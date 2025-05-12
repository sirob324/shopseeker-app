import React, { FC } from "react";
import _ from "lodash";
import Currency from "currency.js";

import { Merchant } from "interfaces/cart";

import CurrencyModel from "model/currency";

import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";

import { calculateSubtotalPrice } from "helpers/cart";

import { trans } from "locales";

import Style from "style";

interface Props {
    merchant: Merchant;
}

const CartDelivery: FC<Props> = ({ merchant }) => {
    const currency = _.get(merchant, "region.currency");

    const symbol = _.get(
        CurrencyModel,
        `code.${_.toUpper(currency)}.symbol`,
        "$"
    );

    const subTotalPrice = calculateSubtotalPrice(_.get(merchant, "items", []));

    return _.has(merchant, "shipping.distance") ? (
        <Div
            style={[
                Style.row,
                Style.column_center,
                Style.row_start,
                Style.w_p100,
                Style.m_t_2,
                Style.wrap,
            ]}
        >
            {/* <Div style={[Style.h_center, Style.p_r_2]}>
                <Text style={[Style.f_size_11, Style.f_weight_500]}>
                    {trans("navlinkDelivery")}
                </Text>
            </Div> */}
            {_.has(merchant, "shipping.distance") && (
                <Div style={[Style.h_center, Style.p_r_2]}>
                    <Icon
                        name="car-outline"
                        size={Style.f_size_17.fontSize}
                        color={Style.f_color_dark_medium.color}
                    />
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark_bold,
                            Style.m_l_1,
                        ]}
                    >
                        {`${Currency(merchant.shipping.distance).value.toFixed(
                            2
                        )} `}
                        {_.get(merchant, "region.mileage") &&
                            trans(`mileage_${merchant.region.mileage}`)}
                    </Text>
                </Div>
            )}
            {_.has(merchant, "shipping.duration") && (
                <Div style={[Style.h_center, Style.p_r_2]}>
                    <Icon
                        name="time-outline"
                        size={Style.f_size_17.fontSize}
                        color={Style.f_color_dark_medium.color}
                    />
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark_bold,
                            Style.m_l_1,
                        ]}
                    >
                        {`${Currency(merchant.shipping.duration).value.toFixed(
                            0
                        )} ${trans("minutes")}`}
                    </Text>
                </Div>
            )}
            {_.has(merchant, "shipping.fee") && (
                <Div style={[Style.h_center, Style.m_r_2]}>
                    <Text style={[Style.f_size_11]}>{trans("fee")}</Text>
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark_bold,
                            Style.m_l_1,
                        ]}
                    >
                        {`${symbol} ${Currency(
                            merchant.shipping.fee
                        ).value.toFixed(2)}`}
                    </Text>
                </Div>
            )}
            {_.has(merchant, "shipping.tipRate") && (
                <Div style={[Style.h_center, Style.m_r_2]}>
                    <Text style={[Style.f_size_11]}>{trans("tip")}</Text>
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark_bold,
                            Style.m_l_1,
                        ]}
                    >
                        {`${symbol} ${Currency(subTotalPrice)
                            .multiply(merchant.shipping.tipRate)
                            .value.toFixed(2)}`}
                    </Text>
                </Div>
            )}
        </Div>
    ) : null;
};

export default CartDelivery;
