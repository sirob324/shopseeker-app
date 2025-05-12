import React, { FC, useState } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { TabView, TabBar } from "react-native-tab-view";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";

import Login from "containers/identity/login";
import Signup from "containers/identity/signup";
import Signin from "containers/identity/signin";
import ForgotPassword from "containers/identity/forgot-password";

import { DEVICE_WIDTH } from "config/constant";

import { redirectToShop } from "utils/navigation";

import Order from "customer/containers/order";
import Profile from "customer/containers/profile";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const ShopProfilePage: FC<Props> = (props) => {
    const { sub_tab: tab, user, shop } = props;

    const isLoggedIn = _.has(user, "id") && !!_.get(user, "id");

    const progresses = ["signin", "signup", "forgot-password"];

    const _progress = !isLoggedIn
        ? _.includes(progresses, tab)
            ? tab
            : "signin"
        : "profile";

    const [tabIndex, setTabIndex] = useState(tab === "order" ? 1 : 0);

    const [progress, setProgress] = useState(_progress);

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
                    <Div style={[Style.column, Style.row_center, Style.h_p100]}>
                        <Signin
                            {...props}
                            changeNav={(progress: string) =>
                                changeProgress(progress)
                            }
                            callback={{
                                success: () =>
                                    redirectToShop({
                                        id: shop.id,
                                        tab: "home",
                                        sub_tab: "",
                                    }),
                            }}
                        />

                        <Login
                            {...props}
                            changeNav={(progress: string) =>
                                changeProgress(progress)
                            }
                            callback={{
                                success: () =>
                                    redirectToShop({
                                        id: shop.id,
                                        tab: "home",
                                        sub_tab: "",
                                    }),
                            }}
                        />

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
                    </Div>
                );
                break;

            case "signup":
                component = (
                    <Div style={[Style.column, Style.row_center, Style.h_p100]}>
                        <Signup
                            {...props}
                            changeNav={(progress: string) =>
                                changeProgress(progress)
                            }
                            callback={{
                                success: () =>
                                    redirectToShop({
                                        id: shop.id,
                                        tab: "profile",
                                    }),
                            }}
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
                    </Div>
                );
                break;

            case "forgot-password":
                component = (
                    <Div style={[Style.column, Style.row_center, Style.h_p100]}>
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
                    </Div>
                );
                break;

            case "profile":
            default:
                component = (
                    <TabView
                        lazy
                        navigationState={{
                            index: tabIndex,
                            routes: [
                                {
                                    key: "profile",
                                    title: trans("navlinkProfile"),
                                },
                                { key: "order", title: trans("navlinkOrder") },
                            ],
                        }}
                        renderTabBar={(props) => (
                            <TabBar
                                {...props}
                                renderLabel={({ route, focused }) => (
                                    <Text
                                        style={[
                                            Style.f_size_15,
                                            Style.f_weight_500,
                                            focused
                                                ? Style.f_color_primary
                                                : Style.f_color_dark_medium,
                                        ]}
                                    >
                                        {route.title}
                                    </Text>
                                )}
                                tabStyle={{
                                    ...Style.bg_color_15,
                                    ...Style.p_h_3,
                                    width: "auto",
                                }}
                                style={{ ...Style.bg_color_15 }}
                            />
                        )}
                        renderScene={({ route, jumpTo }) => {
                            switch (route.key) {
                                case "profile":
                                    return (
                                        <Profile jumpTo={jumpTo} {...props} />
                                    );
                                case "order":
                                    return <Order jumpTo={jumpTo} {...props} />;
                            }
                        }}
                        onIndexChange={(index: number) => setTabIndex(index)}
                        initialLayout={{ width: DEVICE_WIDTH }}
                    />
                );
                break;
        }

        return component;
    };

    return <Div style={[Style.column, Style.h_p100]}>{renderView()}</Div>;
};

const mapStateToProps = (state: any) => {
    return {
        user: state.profile.user,
    };
};

export default connect(mapStateToProps)(ShopProfilePage);
