import React, { FC } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import CurrencyModel from "model/currency";

import { CartItem } from "interfaces/cart";

import { clearItemFromCart } from "actions/cart";

import { calculateItemPrice } from "helpers/cart";

import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import { CounterWidth } from "components/counter";
import PlusMinus from "components/product-plus-minus";
import ProductCardRow from "components/product-card/row";

import Style from "style";

type Props = {
    item: CartItem;
    currency: string;
    canEdit: boolean;
    clear_item: (item: any) => void;
};

const CartItemC: FC<Props> = ({ item, currency, canEdit, clear_item }) => {
    const itemPrice = calculateItemPrice(item);

    const symbol = _.get(
        CurrencyModel,
        `code.${_.toUpper(currency)}.symbol`,
        "$"
    );

    return (
        <Div
            style={[
                Style.row,
                Style.row_between,
                Style.column_center,
                Style.b_b_light_medium,
                Style.p_2,
            ]}
        >
            <Div
                style={[
                    Style.flex,
                    Style.row,
                    canEdit && { paddingLeft: CounterWidth },
                ]}
            >
                {canEdit && <PlusMinus type="vertical" item={item} />}

                <ProductCardRow item={item} currency={symbol} />
            </Div>

            <Div style={[Style.row, Style.row_end]}>
                <Text style={[Style.f_size_13, Style.f_weight_500]}>
                    {`${symbol} ${itemPrice}`}
                </Text>

                {canEdit && (
                    <Div
                        onClick={() => clear_item(item)}
                        style={[Style.h_center, Style.m_l_2]}
                    >
                        <Icon
                            name="close"
                            size={Style.f_size_20.fontSize}
                            color={Style.f_color_dark.color}
                        />
                    </Div>
                )}
            </Div>
        </Div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        clear_item: (item) => dispatch(clearItemFromCart(item)),
    };
};

export default connect(null, mapDispatchToProps)(CartItemC);
