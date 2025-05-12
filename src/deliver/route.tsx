import React from "react";
import _ from "lodash";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import {
    MAIN_STACK,
    TERMS_PAGE,
    PRIVACY_PAGE,
    DELIVER_PAGE,
    DELIVERY_DETAIL_PAGE,
} from "config/route";

import A from "components/a";
import Icon from "components/icon";
import Text from "components/text";
import LanguageSwitcher from "components/language-switcher";

import TermsPage from "containers/identity/terms";
import PrivacyPage from "containers/identity/privacy";

import { trans } from "locales";

import Style from "style";

import IndexPage from "deliver/pages";
import Drawer from "deliver/pages/drawer";
import DeliveryDetailPage from "deliver/pages/delivery/detail";

const Stack = createStackNavigator();
const DrawerNavigator = createDrawerNavigator();

const Deliver = () => {
    return (
        <Stack.Navigator initialRouteName={DELIVER_PAGE}>
            <Stack.Screen
                name={DELIVER_PAGE}
                options={({ navigation }) => ({
                    headerShown: true,
                    title: trans("userTypeDeliver"),
                    headerTitleStyle: [
                        Style.f_size_15,
                        Style.f_color_dark_bold,
                        Style.f_weight_500,
                    ],
                    headerLeft: () => (
                        <A
                            onPress={() => navigation.toggleDrawer()}
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.p_l_3,
                            ]}
                        >
                            <Icon
                                name="menu"
                                size={Style.f_size_25.fontSize}
                                color={Style.f_color_dark_medium.color}
                            />
                        </A>
                    ),
                    headerRight: () => <LanguageSwitcher />,
                })}
                component={IndexPage}
            />
            <Stack.Screen
                name={DELIVERY_DETAIL_PAGE}
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
                component={DeliveryDetailPage}
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

const Route = () => (
    <DrawerNavigator.Navigator
        lazy={true}
        drawerPosition="left"
        hideStatusBar={true}
        minSwipeDistance={100}
        overlayColor={Style.bg_transparent_5.backgroundColor}
        statusBarAnimation="fade"
        drawerContent={(props) => <Drawer {...props} />}
    >
        <DrawerNavigator.Screen name="Root">
            {() => (
                <Stack.Navigator
                    initialRouteName={MAIN_STACK}
                    mode="modal"
                    headerMode="none"
                >
                    <Stack.Screen name={MAIN_STACK} component={Deliver} />
                </Stack.Navigator>
            )}
        </DrawerNavigator.Screen>
    </DrawerNavigator.Navigator>
);

export default Route;
