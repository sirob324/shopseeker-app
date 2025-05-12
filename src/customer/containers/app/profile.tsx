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

import Signin from "containers/identity/signin";
import Signup from "containers/identity/signup";
import ForgotPassword from "containers/identity/forgot-password";

import Order from "customer/containers/order";
import Profile from "customer/containers/profile";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

type State = {
    progress: string;
};

class ProfilePage extends Component<Props, State> {
    state = {
        progress: "",
    };

    auth = ["terms", "privacy", "signin", "signup", "forgot-password"];

    progresses = ["profile", "order"];

    componentDidMount() {
        this.init();
    }

    init = () => {
        const {
            user,
            query: { sub_tab },
        } = this.props;

        const isLoggedIn: boolean = !!_.get(user, "id");

        const _progress = !isLoggedIn
            ? _.includes(this.auth, sub_tab)
                ? sub_tab
                : "signin"
            : _.includes(this.progresses, sub_tab)
            ? sub_tab
            : "profile";

        this.setState({
            progress: _progress,
        });
    };

    changeProgress = (progress: string) => {
        this.state.progress !== progress && this.setState({ progress });
    };

    renderView = () => {
        const { progress } = this.state;
        const { query } = this.props;

        let component: any = null;

        switch (progress) {
            case "signin":
                component = (
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
                        <Signin
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
                    </Div>
                );
                break;

            case "signup":
                component = (
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
                        <Signup
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
                    </Div>
                );
                break;

            case "forgot-password":
                component = (
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
                        <ForgotPassword
                            changeNav={(progress: string) =>
                                this.changeProgress(progress)
                            }
                        />

                        <Div
                            style={[Style.h_center, Style.m_t_2]}
                            onClick={() => this.changeProgress("signin")}
                        >
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_dark,
                                    Style.f_weight_500,
                                    Style.underline,
                                ]}
                            >
                                {trans("signin")}
                            </Text>
                        </Div>
                    </Div>
                );
                break;

            case "profile":
                component = (
                    <Div
                        style={[
                            Style.column,
                            Style.p_h_4,
                            {
                                height:
                                    DEVICE_HEIGHT -
                                    NAVIGATION_BAR_HEIGHT -
                                    FOOTER_BAR_HEIGHT,
                            },
                        ]}
                    >
                        <Profile {...query} />
                    </Div>
                );
                break;

            case "order":
                component = (
                    <Div
                        style={[
                            Style.column,
                            Style.p_h_2,
                            {
                                height:
                                    DEVICE_HEIGHT -
                                    NAVIGATION_BAR_HEIGHT -
                                    FOOTER_BAR_HEIGHT,
                            },
                        ]}
                    >
                        <Order {...query} />
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
                    {
                        paddingTop: NAVIGATION_BAR_HEIGHT,
                    },
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
    };
};

export default connect(mapStateToProps)(ProfilePage);
