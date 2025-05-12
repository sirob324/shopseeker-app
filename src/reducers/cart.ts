import _ from "lodash";

import { Tax } from "interfaces/region";
import { Coupon } from "interfaces/coupon";
import { CartItem, Merchant } from "interfaces/cart";

import { CART } from "actions/types";

interface ACTION {
    type: string;
    payload: string | object | null;
}

interface initialStateProps {
    items: CartItem[];
    coupon: Coupon | null;
    merchants: Merchant[];
    subtotalPrice: 0;
    totalTax: Tax | null;
    totalDeliveryFee: 0;
    totalDeliveryTip: 0;
}

const initialState: initialStateProps = {
    items: [],
    coupon: null,
    merchants: [],
    subtotalPrice: 0,
    totalTax: null,
    totalDeliveryFee: 0,
    totalDeliveryTip: 0,
};

function Cart(state = initialState, action: ACTION) {
    switch (action.type) {
        case CART.ADD_ITEM:
            return {
                ...state,
                items: action.payload,
            };

        case CART.REMOVE_ITEM:
            return {
                ...state,
                items: action.payload,
            };

        case CART.CLEAR_ITEM_FROM_CART:
            return {
                ...state,
                items: state.items.filter(
                    (item) => item.id !== _.get(action, "payload.id")
                ),
            };

        case CART.CLEAR_CART:
            return initialState;

        case CART.APPLY_COUPON:
            return {
                ...state,
                coupon: action.payload,
            };

        case CART.REMOVE_COUPON:
            return {
                ...state,
                coupon: null,
            };

        case CART.UPDATE_MERCHANTS:
            return {
                ...state,
                merchants: action.payload,
            };

        case CART.UPDATE_SUBTOTAL:
            return {
                ...state,
                subtotalPrice: action.payload,
            };

        case CART.UPDATE_TOTAL_TAX:
            return {
                ...state,
                totalTax: action.payload,
            };

        case CART.UPDATE_TOTAL_DELIVERY_FEE:
            return {
                ...state,
                totalDeliveryFee: action.payload,
            };

        case CART.UPDATE_TOTAL_DELIVERY_TIP:
            return {
                ...state,
                totalDeliveryTip: action.payload,
            };

        default: {
            return state;
        }
    }
}

export default Cart;
