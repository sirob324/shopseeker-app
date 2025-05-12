import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import {
    DEVICE_HEIGHT,
    FOOTER_BAR_HEIGHT,
    NAVIGATION_BAR_HEIGHT,
} from "config/constant";

import { redirectToApp } from "utils/navigation";

import Lib from "helpers/lib";

import Div from "components/div";
import Text from "components/text";
import Button from "components/button";
import NoResultFound from "components/no-result";

import Checkout from "containers/checkout";
import Merchant from "containers/cart/merchant";
import ConfirmOrder from "containers/confirm-order";

import SigninForCart from "containers/identity/signin-for-cart";

import NavBar from "containers/bar/nav-bar";
import HeaderBar from "containers/bar/header-bar";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

type State = {
    progress: string;
};

class CartPage extends Component<Props, State> {
    progresses = ["cart", "signin", "checkout", "confirm"];

    state = {
        progress: "cart",
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const { user } = this.props;
        const { progress } = this.state;

        const isLoggedIn: boolean = !!_.get(user, "id");

        const _progress =
            isLoggedIn && progress === "signin"
                ? "checkout"
                : _.includes(this.progresses, progress)
                ? progress
                : "cart";

        this.setState({
            progress: _progress,
        });
    };

    changeProgress = (progress: string) => {
        this.state.progress !== progress && this.setState({ progress });
    };

    renderView = () => {
        const { merchants, user } = this.props;
        const { progress } = this.state;

        const isLoggedIn: boolean = !!_.get(user, "id");

        let component: any = null;

        switch (progress) {
            case "cart":
                component = _.isEmpty(merchants) ? (
                    <Div
                        style={[
                            Style.v_center,
                            {
                                height:
                                    DEVICE_HEIGHT -
                                    NAVIGATION_BAR_HEIGHT -
                                    FOOTER_BAR_HEIGHT,
                            },
                        ]}
                    >
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerTitle={trans("navlinkCart")}
                        />
                        <NoResultFound />
                        <Button
                            size="big"
                            onPress={() => redirectToApp()}
                            trans="home"
                            style={[
                                Style.w_p25,
                                Style.m_v_4,
                                Style.p_h_2,
                                Style.bg_color_first,
                                Style.border_round_4,
                            ]}
                            titleStyle={[Style.f_color_15]}
                        />
                    </Div>
                ) : (
                    <Div
                        style={[
                            Style.column,
                            {
                                paddingBottom: FOOTER_BAR_HEIGHT,
                            },
                        ]}
                    >
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerTitle={trans("navlinkCart")}
                        />
                        <Merchant showDelivery={true} />
                        <Button
                            size="fullwidth"
                            onPress={() =>
                                this.changeProgress(
                                    isLoggedIn ? "checkout" : "signin"
                                )
                            }
                            trans="continue"
                            style={[
                                Style.m_v_4,
                                { width: "calc(100% - 20px)" },
                            ]}
                        />
                    </Div>
                );
                break;

            case "signin":
                component = (
                    <Div style={[Style.column]}>
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerLeft={
                                <NavBar
                                    onClick={() => this.changeProgress("cart")}
                                    rightNav={
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_2,
                                                Style.f_weight_500,
                                            ]}
                                        >
                                            {trans("back")}
                                        </Text>
                                    }
                                />
                            }
                            headerTitle={trans("navlinkCart")}
                        />

                        <SigninForCart
                            changeNav={(progress: string) =>
                                this.changeProgress(progress)
                            }
                            callback={{
                                success: () => {
                                    redirectToApp({ tab: "profile" });
                                },
                                fail: () => Lib.showToast(trans("failed")),
                            }}
                        />

                        <Button
                            size="fullwidth"
                            onPress={() => this.changeProgress("checkout")}
                            trans="guestForCheckout"
                            style={[Style.bg_color_light_medium]}
                            titleStyle={[
                                Style.f_size_15,
                                Style.f_color_dark_medium,
                                Style.f_weight_500,
                            ]}
                        />
                    </Div>
                );
                break;

            case "checkout":
                component = _.isEmpty(merchants) ? (
                    <Div style={[Style.v_center, Style.h_p100]}>
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerTitle={trans("navlinkCart")}
                        />
                        <NoResultFound />
                    </Div>
                ) : (
                    <Div
                        style={[
                            Style.column,
                            { paddingBottom: FOOTER_BAR_HEIGHT },
                        ]}
                    >
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerLeft={
                                <NavBar
                                    onClick={() =>
                                        this.changeProgress(
                                            isLoggedIn ? "cart" : "signin"
                                        )
                                    }
                                    rightNav={
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_2,
                                                Style.f_weight_500,
                                            ]}
                                        >
                                            {trans("back")}
                                        </Text>
                                    }
                                />
                            }
                            headerTitle={trans("navlinkCart")}
                        />

                        <Checkout
                            changeNav={(progress: string) =>
                                this.changeProgress(progress)
                            }
                        />
                    </Div>
                );
                break;

            case "confirm":
                component = _.isEmpty(merchants) ? (
                    <Div style={[Style.v_center, Style.h_p100]}>
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerTitle={trans("navlinkCart")}
                        />
                        <NoResultFound />
                    </Div>
                ) : (
                    <Div
                        style={[
                            Style.column,
                            { paddingBottom: FOOTER_BAR_HEIGHT },
                        ]}
                    >
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerLeft={
                                <NavBar
                                    onClick={() =>
                                        this.changeProgress("checkout")
                                    }
                                    rightNav={
                                        <Text
                                            style={[
                                                Style.f_color_2,
                                                Style.f_weight_500,
                                                Style.f_size_13,
                                            ]}
                                        >
                                            {trans("back")}
                                        </Text>
                                    }
                                />
                            }
                            headerTitle={trans("navlinkCart")}
                        />

                        <ConfirmOrder
                            changeNav={(progress: string) =>
                                this.changeProgress(progress)
                            }
                        />
                    </Div>
                );
                break;
        }

        return component;
    };

    render() {
        return (
            <Div
                style={[
                    Style.column,
                    Style.overflow_hidden,
                    Style.bg_color_15,
                    { paddingTop: NAVIGATION_BAR_HEIGHT },
                ]}
            >
                {this.renderView()}
            </Div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        user: state.profile.user,
        merchants: state.cart.merchants,
    };
};

export default connect(mapStateToProps)(CartPage);
