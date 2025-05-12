import React, { FC } from "react";
import _ from "lodash";

import { DEVICE_WIDTH } from "config/constant";

import { CartItem } from "interfaces/cart";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Scroll from "components/scroll";
import ProductCard from "components/product-card";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const Products: FC<Props> = ({ data, onSearch }) => {
    const fetchLimit = 10;

    const renderTopSales = () => {
        let render: any = null;

        if (_.has(data, "topSales") && !_.isEmpty(data.topSales)) {
            const list = data.topSales;

            render = (
                <Div style={[Style.column, Style.m_b_6]}>
                    <Text style={[Style.f_size_15, Style.f_weight_600]}>
                        {trans("navlinkTopSales")}
                    </Text>
                    <Scroll
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={true}
                        style={[Style.flex, Style.m_t_3]}
                    >
                        {_.map(list, (item: CartItem, index: number) => (
                            <Div
                                key={index}
                                style={[
                                    Style.m_r_4,
                                    {
                                        width: DEVICE_WIDTH / 2.5,
                                    },
                                ]}
                            >
                                <ProductCard item={item} showMerchant={false} />
                            </Div>
                        ))}
                    </Scroll>
                </Div>
            );
        }

        return render;
    };

    const renderCoupons = () => {
        let render: any = null;

        if (_.has(data, "coupons") && !_.isEmpty(data.coupons)) {
            const list = data.coupons;

            render = (
                <Div style={[Style.column, Style.m_b_6]}>
                    <Text style={[Style.f_size_15, Style.f_weight_600]}>
                        {trans("navlinkDiscount")}
                    </Text>
                    <Scroll
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={true}
                        style={[Style.flex, Style.m_t_3]}
                    >
                        {_.map(list, (item: CartItem, _index: number) => (
                            <Div
                                key={_index}
                                style={[
                                    Style.column,
                                    Style.m_r_4,
                                    {
                                        width: DEVICE_WIDTH / 2.5,
                                    },
                                ]}
                            >
                                <ProductCard item={item} showMerchant={false} />
                            </Div>
                        ))}
                    </Scroll>
                </Div>
            );
        }

        return render;
    };

    const renderProductsGroupByCategory = () => {
        let render: any = null;

        if (_.has(data, "products") && !_.isEmpty(data.products)) {
            const _data = _.values(
                _.reduce(
                    data.products,
                    (res: any, product: CartItem) => {
                        const { category } = product;

                        if (!_.isNil(category) && _.has(category, "id")) {
                            if (!_.has(res, category.id)) {
                                res[category.id] = {
                                    ...category,
                                    products: [product],
                                };
                            } else {
                                res[category.id]["products"].push(product);
                            }
                        }

                        return res;
                    },
                    {}
                )
            );

            render = _.map(
                _.orderBy(_.values(_data), ["sequence"], ["desc"]),
                (
                    categoryWithProducts: {
                        id: string;
                        title: string;
                        products: CartItem[];
                    },
                    index: number
                ) => {
                    const { id, title, products } = categoryWithProducts;

                    const hasMore = _.size(products) > fetchLimit;
                    const list = hasMore
                        ? _.slice(products, 0, fetchLimit)
                        : products;

                    return (
                        <Div key={index} style={[Style.column, Style.m_b_6]}>
                            <Div
                                style={[
                                    Style.w_p100,
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
                                ]}
                            >
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_weight_600,
                                    ]}
                                >
                                    {_.upperFirst(title)}
                                </Text>
                                {hasMore && (
                                    <A
                                        style={[Style.h_center, Style.m_r_2]}
                                        onPress={() => onSearch({ id, title })}
                                    >
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_color_primary,
                                                Style.f_weight_500,
                                                Style.m_r_1,
                                            ]}
                                        >
                                            {trans("more")}
                                        </Text>
                                        <Icon
                                            name="chevron-forward"
                                            size={Style.f_size_13.fontSize}
                                            color={Style.f_color_primary.color}
                                        />
                                    </A>
                                )}
                            </Div>
                            <Scroll
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                removeClippedSubviews={true}
                                style={[Style.flex, Style.m_t_3]}
                            >
                                {_.map(
                                    list,
                                    (item: CartItem, _index: number) => (
                                        <Div
                                            key={_index}
                                            style={[
                                                Style.column,
                                                Style.m_r_4,
                                                {
                                                    width: DEVICE_WIDTH / 2.5,
                                                },
                                            ]}
                                        >
                                            <ProductCard
                                                item={item}
                                                showMerchant={false}
                                            />
                                        </Div>
                                    )
                                )}
                            </Scroll>
                        </Div>
                    );
                }
            );
        }

        return render;
    };

    return (
        <Div style={[Style.p_l_4]}>
            {renderTopSales()}
            {renderCoupons()}
            {renderProductsGroupByCategory()}
        </Div>
    );
};

export default Products;
