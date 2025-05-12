import React, { FC } from "react";
import _ from "lodash";
import Currency from "currency.js";

import CurrencyModel from "model/currency";

import { Merchant } from "interfaces/cart";

import {
    calculateSubtotalPrice,
    calculateTotalTax,
    sumTaxObject,
} from "helpers/cart";

import Div from "components/div";
import Text from "components/text";

import { trans } from "locales";

import Style from "style";

interface Props {
    merchant: Merchant;
    currency: string;
}

const CartPrice: FC<Props> = ({ merchant, currency }) => {
    const subTotalPrice = calculateSubtotalPrice(merchant.items || []);
    const totalTax = calculateTotalTax(merchant.items || []);
    const totalTaxValue = sumTaxObject(totalTax);

    const symbol = _.get(
        CurrencyModel,
        `code.${_.toUpper(currency)}.symbol`,
        "$"
    );

    return (
        <Div
            style={[Style.row, Style.column_center, Style.row_end, Style.p_v_2]}
        >
            <Div style={[Style.v_center, Style.p_h_2]}>
                <Text style={[Style.f_size_11]}>{trans("subTotal")}</Text>
                <Text style={[Style.f_size_11]}>{`${symbol} ${Currency(
                    subTotalPrice
                ).value.toFixed(2)}`}</Text>
            </Div>
            {!_.isEmpty(totalTax) &&
                Object.keys(totalTax).map((name: string, index: number) => (
                    <Div
                        key={index}
                        style={[Style.v_center, Style.p_h_2, Style.b_l_13]}
                    >
                        <Text style={[Style.f_size_11]}>
                            {trans(`tax_${name}`)}
                        </Text>
                        <Text style={[Style.f_size_11]}>
                            {`${symbol} ${Currency(
                                totalTax[name]
                            ).value.toFixed(2)}`}
                        </Text>
                    </Div>
                ))}
            <Div style={[Style.v_center, Style.p_h_2, Style.b_l_13]}>
                <Text style={[Style.f_size_11]}>{trans("total")}</Text>
                <Text style={[Style.f_size_11]}>
                    {`${symbol} ${Currency(subTotalPrice)
                        .add(totalTaxValue)
                        .value.toFixed(2)}`}
                </Text>
            </Div>
        </Div>
    );
};

export default CartPrice;
