import React, { FC } from "react";
import _ from "lodash";

import { IMG_WIDTH, IMG_HEIGHT } from "config/constant";

import { CartItem } from "interfaces/cart";

import Div from "components/div";
import Text from "components/text";
import Image from "components/image";

import { trans } from "locales";

import Style from "style";

interface Props {
    item: CartItem;
    currency: string;
    style?: any[];
}

const CardRow: FC<Props> = ({ item, currency, style = [] }) => {
    const { title, measure, measureUnit, price, salePrice, hasTax } = item;

    const hasSalePrice = !_.isNil(salePrice) && _.toInteger(salePrice) > 0;

    return (
        <Div
            style={[
                Style.row,
                Style.column_center,
                Style.row_between,
                ...style,
            ]}
        >
            <Div
                style={[
                    Style.v_center,
                    Style.m_h_3,
                    {
                        width: IMG_WIDTH / 1.5,
                        height: IMG_HEIGHT / 1.5,
                    },
                ]}
            >
                <Image src={_.get(item, "image")} />
            </Div>

            <Div
                style={[
                    Style.flex,
                    Style.column,
                    Style.column_start,
                    Style.row_between,
                    Style.p_r_2,
                ]}
            >
                <Text
                    style={[Style.f_size_13, Style.f_weight_500]}
                    numberOfLines={2}
                >
                    {_.isNil(hasTax) ||
                        (!hasTax && (
                            <Text
                                style={[
                                    Style.f_size_10,
                                    Style.f_color_first,
                                    Style.f_weight_500,
                                    Style.m_r_2,
                                ]}
                            >
                                {trans("freeTax")}
                            </Text>
                        ))}
                    {title}
                </Text>

                {hasSalePrice && (
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_dark,
                            Style.linethrough,
                            Style.m_t_4,
                        ]}
                    >
                        {currency}
                        {price}
                    </Text>
                )}

                <Div
                    style={[
                        Style.w_p100,
                        Style.row,
                        Style.row_start,
                        Style.column_center,
                        hasSalePrice ? Style.m_t_1 : Style.m_t_5,
                    ]}
                >
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_weight_500,
                            hasSalePrice
                                ? Style.f_color_first
                                : Style.f_color_primary,
                        ]}
                    >
                        {currency}
                        {hasSalePrice ? salePrice : price}
                    </Text>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_weight_500,
                            Style.f_color_dark,
                            Style.m_h_1,
                        ]}
                    >
                        {"/"}
                    </Text>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_weight_500,
                            Style.f_color_dark,
                        ]}
                    >
                        {measure}{" "}
                        {trans(`measure_unit_${_.toUpper(measureUnit)}`)}
                    </Text>
                </Div>
            </Div>
        </Div>
    );
};

export default CardRow;
