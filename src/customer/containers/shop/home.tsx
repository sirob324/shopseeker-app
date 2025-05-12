import React, { FC } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Scroll from "components/scroll";

import { trans } from "locales";

import Style from "style";

import ShopHeader from "./header";
import MerchantProducts from "./products";

type Props = {
    [key: string]: any;
};

const ShopHomePage: FC<Props> = (props) => {
    const { shop, changeRouter, navigation } = props;

    const searchCategory = (category: any) =>
        changeRouter({
            route: "search",
            params: {
                where: {
                    category: category.id,
                    merchant: shop.merchant.id,
                    status: "online",
                },
            },
            header: {
                headerLeft: (
                    <A
                        style={[Style.h_center]}
                        onPress={() =>
                            changeRouter({
                                route: "home",
                            })
                        }
                    >
                        <Icon
                            name="chevron-back"
                            size={Style.f_size_20.fontSize}
                            color={Style.f_color_dark.color}
                        />
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_2,
                                Style.f_weight_500,
                                Style.m_l_2,
                            ]}
                        >
                            {trans("back")}
                        </Text>
                    </A>
                ),
                headerTitle: category.title,
            },
        });

    const searchKeyword = (keyword: string) =>
        changeRouter({
            route: "search",
            params: {
                where: {
                    title_contains: keyword,
                    merchant: shop.merchant.id,
                    status: "online",
                },
            },
            header: {
                headerLeft: (
                    <A
                        style={[Style.h_center]}
                        onPress={() =>
                            changeRouter({
                                route: "home",
                            })
                        }
                    >
                        <Icon
                            name="chevron-back"
                            size={Style.f_size_20.fontSize}
                            color={Style.f_color_dark.color}
                        />
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_2,
                                Style.f_weight_500,
                                Style.m_l_2,
                            ]}
                        >
                            {trans("back")}
                        </Text>
                    </A>
                ),
                headerTitle: trans("search"),
            },
        });

    return (
        <Scroll
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            stickyHeaderIndices={[0]}
        >
            <Div
                onPress={() => navigation.goBack()}
                style={[
                    Style.v_center,
                    Style.m_l_2,
                    Style.bg_transparent_8,
                    Style.p_1,
                    {
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                    },
                ]}
            >
                <Icon
                    name="corner-up-left-outline"
                    size={Style.f_size_17.fontSize}
                    color={Style.f_color_15.color}
                />
            </Div>
            <ShopHeader shop={shop.merchant} onSearch={searchKeyword} />
            <MerchantProducts
                data={_.omit(shop, ["merchant"])}
                onSearch={searchCategory}
            />
        </Scroll>
    );
};

export default ShopHomePage;
