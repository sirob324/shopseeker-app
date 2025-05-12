import React, { Component } from "react";
import _ from "lodash";
import { Provider } from "react-redux";
import { AppState } from "react-native";
import { ApolloProvider } from "@apollo/client";
import { enableScreens } from "react-native-screens";
import { PersistGate } from "redux-persist/integration/react";
import {
    SafeAreaProvider,
    initialWindowMetrics,
} from "react-native-safe-area-context";
import {
    FOREGROUND,
    BACKGROUND,
    INACTIVE,
} from "redux-enhancer-react-native-appstate";
import { StripeProvider } from "@stripe/stripe-react-native";
import { NavigationContainer } from "@react-navigation/native";

import configureStore from "store";
import { navigationRef } from "navigation";

import Config from "config";

import { updateState } from "actions/mode";

import { createApolloClient } from "helpers/apollo";

import App from "app";
import Loading from "components/loading";

enableScreens(false);

type Props = {
    [key: string]: any;
};

type State = {
    rehydrated: boolean;
};

class Root extends Component<Props, State> {
    store: any = null;
    currentState: string = "";

    constructor(props: any) {
        super(props);
        this.state = {
            rehydrated: false,
        };
        this.init();
    }

    componentDidMount() {
        AppState.addEventListener("change", this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this.handleAppStateChange);
    }

    handleAppStateChange = async (nextAppState: string) => {
        const { store } = this;

        if (this.currentState !== nextAppState) {
            let type;
            if (nextAppState === "active") {
                type = FOREGROUND;
            } else if (nextAppState === "background") {
                type = BACKGROUND;
            } else if (nextAppState === "inactive") {
                type = INACTIVE;
            }

            store.dispatch(updateState(type));
        }

        this.currentState = nextAppState;
    };

    init = () => {
        this.store = configureStore(() => this.setState({ rehydrated: true }));
    };

    render() {
        const { store } = this;
        const { rehydrated } = this.state;

        if (!rehydrated) {
            return <Loading />;
        }

        return (
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <Provider store={store}>
                    <PersistGate
                        persistor={store.persistor}
                        loading={<Loading />}
                    >
                        <StripeProvider
                            urlScheme="shopseeker"
                            setUrlSchemeOnAndroid={true}
                            publishableKey={Config.STRIPE_PUBLISHABLE_KEY}
                            merchantIdentifier={Config.MERCHANT_IDENTIFIER}
                            threeDSecureParams={{
                                backgroundColor: "#FFF",
                                timeout: 5,
                            }}
                        >
                            <ApolloProvider client={createApolloClient()}>
                                <NavigationContainer
                                    ref={navigationRef}
                                    fallback={<Loading />}
                                    onReady={() =>
                                        this.handleAppStateChange("active")
                                    }
                                >
                                    <App />
                                </NavigationContainer>
                            </ApolloProvider>
                        </StripeProvider>
                    </PersistGate>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

export default Root;
