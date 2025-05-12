import React, { FC, useState } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Scroll from "components/scroll";

// import Login from "containers/identity/login";
import Signup from "containers/identity/signup";
import Signin from "containers/identity/signin";
import ForgotPassword from "containers/identity/forgot-password";

import { redirectToApp } from "utils/navigation";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const IdentityPage: FC<Props> = ({ navigation, type }) => {
    const [progress, setProgress] = useState("signin");

    const changeProgress = (_progress: string) => {
        if (_progress !== progress) {
            setProgress(_progress);
        }
    };

    const renderView = () => {
        let component: any = null;

        switch (progress) {
            case "signin":
                component = (
                    <>
                        <Signin
                            changeNav={(progress: string) =>
                                changeProgress(progress)
                            }
                            callback={{
                                success: () => redirectToApp(),
                            }}
                        />

                        {/* <Login
                            changeNav={(progress: string) =>
                                changeProgress(progress)
                            }
                            callback={{
                                success: () => redirectToApp(),
                            }}
                        /> */}

                        <A
                            style={[Style.h_center, Style.m_t_4]}
                            onPress={() => changeProgress("signup")}
                        >
                            <Text style={[Style.f_size_15, Style.f_color_dark]}>
                                {trans("dontHaveAccount")}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_weight_500,
                                    Style.underline,
                                    Style.m_l_1,
                                ]}
                            >
                                {trans("signup")}
                            </Text>
                        </A>

                        <A
                            style={[Style.h_center, Style.m_t_4]}
                            onPress={() => changeProgress("forgot-password")}
                        >
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_dark,
                                    Style.underline,
                                ]}
                            >
                                {trans("forgotPassword")}
                            </Text>
                        </A>
                    </>
                );
                break;

            case "signup":
                component = (
                    <>
                        <Signup
                            changeNav={(progress: string) =>
                                changeProgress(progress)
                            }
                            callback={{
                                success: () => redirectToApp(),
                            }}
                            type={type || "account"}
                        />

                        <A
                            style={[Style.h_center, Style.m_t_4]}
                            onPress={() => changeProgress("signin")}
                        >
                            <Text style={[Style.f_size_15, Style.f_color_dark]}>
                                {trans("alreadyHaveAccount")}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_weight_500,
                                    Style.underline,
                                    Style.m_l_1,
                                ]}
                            >
                                {trans("signin")}
                            </Text>
                        </A>
                    </>
                );
                break;

            case "forgot-password":
                component = (
                    <>
                        <ForgotPassword />

                        <A
                            style={[Style.h_center, Style.m_t_4]}
                            onPress={() => changeProgress("signin")}
                        >
                            <Text style={[Style.f_size_15, Style.f_color_dark]}>
                                {trans("alreadyHaveAccount")}
                            </Text>
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_weight_500,
                                    Style.underline,
                                    Style.m_l_1,
                                ]}
                            >
                                {trans("signin")}
                            </Text>
                        </A>
                    </>
                );
                break;
        }

        return component;
    };

    return (
        <Scroll
            contentContainerStyle={[Style.column, Style.row_end, Style.h_p100]}
        >
            <Div
                style={[
                    Style.bg_color_15,
                    Style.p_t_4,
                    Style.p_b_6,
                    Style.border_round_top_4,
                ]}
            >
                <Div
                    style={[
                        Style.h_center,
                        Style.position_absolute,
                        Style.bg_color_15,
                        {
                            top: -15,
                            left: "50%",
                            marginLeft: -25,
                            width: 46,
                            height: 46,
                            borderRadius: 23,
                        },
                    ]}
                    onPress={() => navigation.pop()}
                >
                    <Icon name="close-circle" size={30} />
                </Div>
                {renderView()}
            </Div>
        </Scroll>
    );
};

export default IdentityPage;
