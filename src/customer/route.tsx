import React from "react";
import _ from "lodash";
import { createStackNavigator } from "@react-navigation/stack";

import {
    MAIN_STACK,
    DELIVER_IDENTITY_STACK,
    MERCHANT_IDENTITY_STACK,
    APP_PAGE,
    SHOP_PAGE,
    IDENTITY_PAGE,
    TERMS_PAGE,
    PRIVACY_PAGE,
    ORDER_DETAIL_PAGE,
} from "config/route";

import A from "components/a";
import Icon from "components/icon";
import Text from "components/text";

import { trans } from "locales";

import Style from "style";

import IdentityPage from "containers/identity";
import TermsPage from "containers/identity/terms";
import PrivacyPage from "containers/identity/privacy";

import IndexPage from "customer/pages";
import ShopPage from "customer/pages/shop";

import OrderDetailPage from "customer/pages/order/detail";

const Stack = createStackNavigator();

const Customer = () => {
    return (
        <Stack.Navigator initialRouteName={APP_PAGE}>
            <Stack.Screen
                name={APP_PAGE}
                options={() => ({
                    gestureEnabled: true,
                    headerShown: false,
                })}
            >
                {(config) => <IndexPage {...config} />}
            </Stack.Screen>
            <Stack.Screen
                name={SHOP_PAGE}
                options={() => ({
                    gestureEnabled: true,
                    headerShown: false,
                })}
            >
                {(config) => <ShopPage {...config} />}
            </Stack.Screen>
            <Stack.Screen
                name={ORDER_DETAIL_PAGE}
                options={({ navigation }) => ({
                    gestureEnabled: true,
                    headerShown: true,
                    title: trans("orderSerial"),
                    headerTitleStyle: [
                        Style.f_size_15,
                        Style.f_color_dark_bold,
                        Style.f_weight_500,
                    ],
                    headerLeft: () => (
                        <A
                            onPress={() => navigation.goBack()}
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.p_l_1,
                            ]}
                        >
                            <Icon
                                name="chevron-back"
                                size={Style.f_size_15.fontSize}
                                color={Style.f_color_dark_medium.color}
                            />
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_dark_medium,
                                    Style.f_weight_500,
                                    Style.m_l_1,
                                ]}
                            >
                                {trans("back")}
                            </Text>
                        </A>
                    ),
                })}
                component={OrderDetailPage}
            />
            <Stack.Screen
                name={TERMS_PAGE}
                options={({ navigation }) => ({
                    gestureEnabled: true,
                    headerShown: true,
                    title: trans("terms_of_use"),
                    headerLeft: () => (
                        <A
                            onPress={() => navigation.goBack()}
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.p_l_1,
                            ]}
                        >
                            <Icon
                                name="chevron-back"
                                size={Style.f_size_15.fontSize}
                                color={Style.f_color_dark_medium.color}
                            />
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_dark_medium,
                                    Style.f_weight_500,
                                    Style.m_l_1,
                                ]}
                            >
                                {trans("back")}
                            </Text>
                        </A>
                    ),
                })}
                component={TermsPage}
            />
            <Stack.Screen
                name={PRIVACY_PAGE}
                options={({ navigation }) => ({
                    gestureEnabled: true,
                    headerShown: true,
                    title: trans("privacy_policy"),
                    headerLeft: () => (
                        <A
                            onPress={() => navigation.goBack()}
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.p_l_1,
                            ]}
                        >
                            <Icon
                                name="chevron-back"
                                size={Style.f_size_15.fontSize}
                                color={Style.f_color_dark_medium.color}
                            />
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_color_dark_medium,
                                    Style.f_weight_500,
                                    Style.m_l_1,
                                ]}
                            >
                                {trans("back")}
                            </Text>
                        </A>
                    ),
                })}
                component={PrivacyPage}
            />
        </Stack.Navigator>
    );
};

const MerchantIdentity = () => {
    return (
        <Stack.Navigator initialRouteName={IDENTITY_PAGE}>
            <Stack.Screen
                name={IDENTITY_PAGE}
                options={() => ({
                    cardStyle: {
                        ...Style.bg_transparent,
                        shadowColor: "#CDCDCD",
                        shadowOffset: { width: 0, height: -6 },
                        shadowOpacity: 0.4,
                        shadowRadius: 6,
                        elevation: 3,
                    },
                    gestureEnabled: true,
                    headerShown: false,
                })}
            >
                {(config) => <IdentityPage {...config} type="merchant" />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const DeliverIdentity = () => {
    return (
        <Stack.Navigator initialRouteName={IDENTITY_PAGE}>
            <Stack.Screen
                name={IDENTITY_PAGE}
                options={() => ({
                    cardStyle: {
                        ...Style.bg_transparent,
                        shadowColor: "#CDCDCD",
                        shadowOffset: { width: 0, height: -6 },
                        shadowOpacity: 0.4,
                        shadowRadius: 6,
                        elevation: 3,
                    },
                    gestureEnabled: true,
                    headerShown: false,
                })}
            >
                {(config) => <IdentityPage {...config} type="deliver" />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const Route = () => {
    return (
        <Stack.Navigator
            initialRouteName={MAIN_STACK}
            mode="modal"
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: "transparent" },
            }}
        >
            <Stack.Screen name={MAIN_STACK} component={Customer} />
            <Stack.Screen
                name={MERCHANT_IDENTITY_STACK}
                component={MerchantIdentity}
            />
            <Stack.Screen
                name={DELIVER_IDENTITY_STACK}
                component={DeliverIdentity}
            />
        </Stack.Navigator>
    );
};

export default Route;
