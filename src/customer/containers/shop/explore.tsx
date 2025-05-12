import React, { FC, useEffect } from "react";
import _ from "lodash";

import { Nav } from "interfaces/nav";
import { Item } from "interfaces/cart";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Scroll from "components/scroll";
import NoResultFound from "components/no-result";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const ShopExplorePage: FC<Props> = (props) => {
    const { shop, changeRouter } = props;

    const categories = _.values(
        _.reduce(
            shop.products,
            (res: any, product: Item) => {
                const { category } = product;

                if (!_.isNil(category) && _.has(category, "id")) {
                    if (!_.has(res, category.id)) {
                        res[category.id] = category;
                    }
                }

                return res;
            },
            {}
        )
    );

    if (_.isEmpty(categories)) {
        return (
            <Div style={[Style.v_center, Style.h_100]}>
                <NoResultFound />
            </Div>
        );
    }

    const onPress = (category: Nav) =>
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
                                route: "explore",
                            })
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
                    </A>
                ),
                headerTitle: category.title,
            },
        });

    return (
        <Scroll
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            contentContainerStyle={[
                Style.row,
                Style.row_between,
                Style.column_center,
                Style.wrap,
                Style.h_p100,
                Style.p_2,
            ]}
        >
            {_.map(categories, (category: Nav, index: number) => (
                <Div
                    key={index}
                    style={[
                        Style.w_p47,
                        Style.v_center,
                        Style.bg_color_15,
                        Style.shadow,
                        Style.m_b_4,
                        Style.border_round_2,
                        Style.p_3,
                    ]}
                    onPress={() => onPress(category)}
                >
                    <Text style={[Style.f_size_13, Style.f_weight_600]}>
                        {category.title}
                    </Text>
                </Div>
            ))}
        </Scroll>
    );
};

export default ShopExplorePage;
