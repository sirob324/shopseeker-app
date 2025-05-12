import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Button from "components/button";
import Scroll from "components/scroll";
import NoResultFound from "components/no-result";

import HeaderBar from "containers/bar/header-bar";
import Checkout from "containers/checkout";
import Merchant from "containers/cart/merchant";
import ConfirmOrder from "containers/confirm-order";
import SigninForCart from "containers/identity/signin-for-cart";

import {
    FOOTER_BAR_HEIGHT,
    HEADER_BAR_HEIGHT,
    WINDOW_WIDTH,
} from "config/constant";

import { redirectToShop } from "utils/navigation";

import Lib from "helpers/lib";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const ShopCartPage: FC<Props> = (props) => {
    const { user, merchants, sub_tab, shop } = props;

    const sub_tabs = ["cart", "signin", "checkout", "confirm"];

    const isLoggedIn = _.has(user, "id") && !!_.get(user, "id");

    const [progress, changeProgress] = useState("cart");

    useEffect(() => {
        let _progress = "cart";

        if (isLoggedIn && sub_tab === "signin") {
            _progress = "checkout";
        } else if (_.includes(sub_tabs, sub_tab)) {
            _progress = sub_tab;
        }

        if (_progress !== progress) {
            changeProgress(_progress);
        }
    }, [sub_tab]);

    const renderView = () => {
        let component: any = null;

        switch (progress) {
            case "cart":
                component = (
                    <Div style={[Style.column, Style.h_p100]}>
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerTitle={trans("navlinkCart")}
                        />

                        <Scroll
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            contentContainerStyle={[
                                {
                                    paddingTop: HEADER_BAR_HEIGHT,
                                    paddingBottom: FOOTER_BAR_HEIGHT + 10,
                                },
                            ]}
                        >
                            <Merchant showDelivery={true} />
                        </Scroll>

                        <Div
                            style={[
                                Style.bottom_horizontal,
                                Style.bg_color_15,
                                Style.shadow_top,
                            ]}
                        >
                            <Button
                                size="fullwidth"
                                trans="continue"
                                style={[
                                    Style.m_v_2,
                                    Style.p_v_3,
                                    { width: WINDOW_WIDTH - 20 },
                                ]}
                                onPress={() =>
                                    changeProgress(
                                        isLoggedIn ? "checkout" : "signin"
                                    )
                                }
                            />
                        </Div>
                    </Div>
                );
                break;

            case "signin":
                component = (
                    <Div style={[Style.column, Style.h_p100]}>
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerLeft={
                                <Div
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.w_p100,
                                        Style.p_v_3,
                                    ]}
                                    onPress={() => changeProgress("cart")}
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
                                </Div>
                            }
                            headerTitle={trans("navlinkCart")}
                        />

                        <Scroll
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            contentContainerStyle={[
                                {
                                    paddingTop: HEADER_BAR_HEIGHT,
                                    paddingBottom: FOOTER_BAR_HEIGHT,
                                },
                            ]}
                        >
                            <SigninForCart
                                merchant={shop}
                                changeNav={(progress: string) =>
                                    changeProgress(progress)
                                }
                                callback={{
                                    success: () => {
                                        redirectToShop({
                                            id: shop.id,
                                            tab: "cart",
                                            sub_tab: "signin",
                                        });
                                    },
                                    fail: () => Lib.showToast(trans("failed")),
                                }}
                            />
                        </Scroll>

                        <Div
                            style={[Style.bottom_horizontal, Style.bg_color_15]}
                        >
                            <Button
                                size="fullwidth"
                                trans="guestForCheckout"
                                style={[
                                    Style.bg_color_light_medium,
                                    Style.m_b_2,
                                    Style.p_v_3,
                                    { width: WINDOW_WIDTH - 20 },
                                ]}
                                titleStyle={[
                                    Style.f_color_dark_medium,
                                    Style.f_weight_500,
                                ]}
                                onPress={() => changeProgress("checkout")}
                            />
                        </Div>
                    </Div>
                );
                break;

            case "checkout":
                component = (
                    <Div style={[Style.column, Style.h_p100]}>
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerLeft={
                                <Div
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.w_p100,
                                        Style.p_v_3,
                                    ]}
                                    onPress={() =>
                                        changeProgress(
                                            isLoggedIn ? "cart" : "signin"
                                        )
                                    }
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
                                </Div>
                            }
                            headerTitle={trans("navlinkCart")}
                        />

                        <Checkout
                            {...props}
                            changeNav={(progress: string) =>
                                changeProgress(progress)
                            }
                        />
                    </Div>
                );
                break;

            case "confirm":
                component = (
                    <Div style={[Style.column, Style.h_p100]}>
                        <HeaderBar
                            style={[Style.bg_color_15, Style.shadow_bottom]}
                            headerLeft={
                                <Div
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.w_p100,
                                        Style.p_v_3,
                                    ]}
                                    onPress={() => changeProgress("checkout")}
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
                                </Div>
                            }
                            headerTitle={trans("navlinkCart")}
                        />

                        <ConfirmOrder
                            {...props}
                            merchant={shop}
                            updateCartProgress={(progress: string) =>
                                changeProgress(progress)
                            }
                        />
                    </Div>
                );
                break;
        }

        return component;
    };

    return (
        <Div style={[Style.column]}>
            {_.isEmpty(merchants) ? (
                <Div style={[Style.v_center, Style.h_p100]}>
                    <NoResultFound />
                </Div>
            ) : (
                renderView()
            )}
        </Div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        user: state.profile.user,
        merchants: state.cart.merchants,
    };
};

export default connect(mapStateToProps)(ShopCartPage);
