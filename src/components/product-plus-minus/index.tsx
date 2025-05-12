import React, { FC } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { Item, CartItem } from "interfaces/cart";

import {
    addItemRequest as addItem,
    removeItemRequest as removeItem,
} from "actions/cart";

import { itemInCart, getItem } from "helpers/cart";

import A from "components/a";
import Icon from "components/icon";
import Counter from "components/counter";

import Style from "style";

interface Props {
    item: Item;
    type?: "horizontal" | "vertical";
    items: CartItem[];
    add_item: (data: Item) => void;
    remove_item: (data: Item) => void;
}

const ProductPlusMinus: FC<Props> = ({
    item,
    type,
    items,
    add_item,
    remove_item,
}) => {
    const itemIsInCart: boolean = itemInCart(items, item.id);

    const itemQuantity = getItem(items, item.id, "quantity");

    return itemIsInCart ? (
        <Counter
            type={type}
            value={!itemQuantity ? 0 : itemQuantity}
            onInc={() => add_item(item)}
            onDec={() => remove_item(item)}
        />
    ) : (
        <A
            onPress={() => add_item(item)}
            style={[
                Style.bottom_right,
                Style.v_center,
                Style.p_0,
                Style.b_primary,
                {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                },
            ]}
        >
            <Icon
                name="add"
                size={Style.f_size_16.fontSize}
                color={Style.f_color_primary.color}
            />
        </A>
    );
};

ProductPlusMinus.defaultProps = {
    type: "horizontal",
};

const mapStateToProps = (state: any) => {
    return {
        items: state.cart.items,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        add_item: (data: Item) => dispatch(addItem(data)),
        remove_item: (data: Item) => dispatch(removeItem(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPlusMinus);
