import React, { Component } from "react";
import _ from "lodash";

import { Router } from "interfaces/router";

import SafeAreaView from "components/safe-area-view";

import BetaPage from "customer/containers/app/beta";

type Props = {};

type State = {
    router: Router;
};

class App extends Component<Props, State> {
    progresses = ["beta", "home", "search", "cart", "profile", "payment"];

    tabs = ["home", "search", "cart", "profile"];

    _router = _.get(this.props, "route");

    state = {
        router: {
            route: "",
        },
    };

    componentDidMount() {
        this.init();
    }

    init = () => {
        const progress = _.toLower(_.get(this._router, "params.tab"));

        const route = _.includes(this.progresses, progress) ? progress : "beta";

        this.setState({
            router: { route },
        });
    };

    changeRouter = (_router: Router) => {
        const { router } = this.state;

        this.setState({
            router: {
                ...router,
                ..._router,
            },
        });
    };

    renderView = () => {
        const { router } = this.state;

        const params = _.get(this._router, "params", {});

        let component: any = null;

        switch (router.route) {
            case "beta":
                component = <BetaPage query={params} />;
                break;

            // case "home":
            //     component = <HomePage query={params} />;
            //     break;

            // case "search":
            //     component = (
            //         <SearchPage
            //             query={params}
            //             router={router}
            //             changeRouter={this.changeRouter}
            //         />
            //     );
            //     break;

            // case "cart":
            //     component = (
            //         <CartPage
            //             query={params}
            //             router={router}
            //             changeRouter={this.changeRouter}
            //         />
            //     );
            //     break;

            // case "profile":
            //     component = (
            //         <ProfilePage
            //             query={params}
            //             router={router}
            //             changeRouter={this.changeRouter}
            //         />
            //     );
            //     break;
        }

        return component;
    };

    render() {
        const { router } = this.state;

        return (
            <SafeAreaView edges={["left", "right", "top"]}>
                {this.renderView()}
                {/* <Div>
                    {_.includes(this.tabs, router.route) && (
                        <FooterBar
                            router={router}
                            changeRouter={this.changeRouter}
                        />
                    )}
                </Div> */}
            </SafeAreaView>
        );
    }
}

export default App;
