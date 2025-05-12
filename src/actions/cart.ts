import { CART } from "./types";

import { Tax } from "interfaces/region";
import { Coupon } from "interfaces/coupon";
import { Item, CartItem, Merchant } from "interfaces/cart";

export function addItemRequest(item: Item, quantity = 1) {
    return {
        type: CART.ADD_ITEM_REQUEST,
        payload: {
            ...item,
            quantity,
        },
    };
}

export function addItem(items: CartItem[]) {
    return {
        type: CART.ADD_ITEM,
        payload: items,
    };
}

export function removeItemRequest(item: Item, quantity = 1) {
    return {
        type: CART.REMOVE_ITEM_REQUEST,
        payload: {
            ...item,
            quantity,
        },
    };
}

export function removeItem(items: CartItem[]) {
    return {
        type: CART.REMOVE_ITEM,
        payload: items,
    };
}

export function clearItemFromCart(item: CartItem) {
    return {
        type: CART.CLEAR_ITEM_FROM_CART,
        payload: item,
    };
}

export function clearCart() {
    return {
        type: CART.CLEAR_CART,
    };
}

export function applyCoupon(coupon: Coupon) {
    return {
        type: CART.APPLY_COUPON,
        payload: coupon,
    };
}

export function removeCoupon() {
    return {
        type: CART.REMOVE_COUPON,
    };
}

export function updateMerchantRequest(merchant: Merchant) {
    return {
        type: CART.UPDATE_MERCHANT_REQUEST,
        payload: merchant,
    };
}

export function updateMerchantsRequest() {
    return {
        type: CART.UPDATE_MERCHANTS_REQUEST,
    };
}

export function updateMerchants(merchants: Merchant[]) {
    return {
        type: CART.UPDATE_MERCHANTS,
        payload: merchants,
    };
}

export function updateSubtotal(data: number) {
    return {
        type: CART.UPDATE_SUBTOTAL,
        payload: data,
    };
}

export function updateTotalTax(data: Tax | {}) {
    return {
        type: CART.UPDATE_TOTAL_TAX,
        payload: data,
    };
}

export function updateTotalDeliveryFee(data: number) {
    return {
        type: CART.UPDATE_TOTAL_DELIVERY_FEE,
        payload: data,
    };
}

export function updateTotalDeliveryTip(data: number) {
    return {
        type: CART.UPDATE_TOTAL_DELIVERY_TIP,
        payload: data,
    };
}
