import React, { useState } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Tabs } from "@ant-design/react-native";

import { HEADER_BAR_HEIGHT, FOOTER_BAR_HEIGHT } from "config/constant";

import { Router } from "interfaces/router";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import NoResultFound from "components/no-result";

import { useMerchant } from "merchant/contexts/app";

import FooterBar from "merchant/layout/footer-bar";

import Home from "merchant/containers/order";
import Statistics from "merchant/containers/statistics";
import Order from "merchant/containers/order/picked-up";
import Product from "merchant/containers/product";
import Category from "merchant/containers/category";
import Profile from "merchant/containers/profile";
import Init from "merchant/containers/profile/init";

import { trans } from "locales";

import Style from "style";

const MerchantRoutes = (props: any) => {
    const { merchant } = useMerchant();

    const { navigation } = props;

    navigation.addListener("focus", () => {
        navigation.setOptions({
            title: _.get(merchant, "name", ""),
        });
    });

    if (!_.isEmpty(merchant) && _.get(merchant, "id", "") === "") {
        return (
            <Div style={[Style.v_center, Style.h_p100]}>
                <NoResultFound />
            </Div>
        );
    }

    if (_.isEmpty(merchant) || !_.get(merchant, "entity", "")) {
        return (
            <Div
                style={[
                    Style.column,
                    Style.row_center,
                    Style.h_p100,
                    Style.bg_color_15,
                ]}
            >
                <Init />
            </Div>
        );
    }

    const [router, changeRouter] = useState<Router>({ route: "home" });

    let component = <></>;

    switch (router.route) {
        case "home":
            component = <Home />;
            break;

        case "statistics":
            component = <Statistics merchant={merchant} />;
            break;

        case "order":
            component = <Order />;
            break;

        case "product":
            const tabs = [
                {
                    title: trans("navlinkProduct"),
                },
                {
                    title: trans("navlinkCategory"),
                },
            ];

            component = (
                <Tabs
                    tabs={tabs}
                    renderTabBar={(tabProps: any) => (
                        <Div
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.w_p100,
                                Style.bg_color_15,
                                Style.shadow_bottom,
                                Style.p_h_2,
                                {
                                    height: HEADER_BAR_HEIGHT + 10,
                                },
                            ]}
                        >
                            {tabProps.tabs.map((tab: any, i: number) => (
                                <A
                                    key={i}
                                    activeOpacity={0.9}
                                    style={[
                                        Style.v_center,
                                        Style.p_h_3,
                                        Style.p_v_2,
                                        Style.border_round_1,
                                        tabProps.activeTab === i &&
                                            Style.bg_color_gray,
                                    ]}
                                    onPress={() => {
                                        const { goToTab, onTabClick } =
                                            tabProps;
                                        onTabClick && onTabClick(tabs[i], i);
                                        goToTab && goToTab(i);
                                    }}
                                >
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_500,
                                            tabProps.activeTab === i &&
                                                Style.f_color_primary,
                                        ]}
                                    >
                                        {tab.title}
                                    </Text>
                                </A>
                            ))}
                        </Div>
                    )}
                >
                    <Product {...props} />
                    <Category {...props} />
                </Tabs>
            );
            break;

        case "profile":
            component = <Profile {...props} />;
            break;
    }

    return (
        <Div style={[Style.v_center, Style.h_p100]}>
            <Div
                style={[
                    Style.column,
                    Style.w_p100,
                    Style.h_p100,
                    Style.bg_color_15,
                    {
                        paddingBottom: FOOTER_BAR_HEIGHT,
                    },
                ]}
            >
                {component}
            </Div>
            <FooterBar router={router} changeRouter={changeRouter} />
        </Div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        locale: state.system.locale,
    };
};

export default connect(mapStateToProps)(MerchantRoutes);
