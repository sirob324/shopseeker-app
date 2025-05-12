import _ from "lodash";
import Currency from "currency.js";

import { Tax } from "interfaces/region";
import { Coupon } from "interfaces/coupon";
import { Cart, Merchant, CartItem } from "interfaces/cart";

import {
    CART_KEY,
    SHIPPING_TYPE_KEY,
    SHIPPING_KEY,
    SHIPPING_TIP_KEY,
    PAYMENT_METHOD_TYPE_KEY,
    PAYMENT_METHOD_KEY,
} from "config/constant";

import { encrypt, decrypt } from "./encrypt";
import { getLocalState, setLocalState, removeLocalState } from "./storage";

export async function setCart(value: Cart) {
    try {
        const data = encrypt(value);
        await setLocalState(CART_KEY, data);
    } catch (error) {
        await setLocalState(CART_KEY, null);
    }
}

export async function getCart() {
    try {
        const encrypted = await getLocalState(CART_KEY);
        if (!encrypted) {
            return {};
        }

        return decrypt(encrypted);
    } catch (error) {
        return {};
    }
}

export async function updateCart(value: any) {
    const cart = await getCart();

    if (_.isEmpty(cart)) {
        await setCart({
            ...value,
        });
    } else {
        await setCart({
            ...cart,
            ...value,
        });
    }
}

export async function removeCart() {
    try {
        await removeLocalState(CART_KEY);
    } catch (error) {}
}

export async function fetchCart(name: string) {
    const cart = await getCart();

    return _.get(cart, name, null);
}

export async function getCartItems() {
    return (await fetchCart("items")) || [];
}

export async function setCartItems(items: CartItem[]) {
    await updateCart({ items });
}

export async function getCartMerchants() {
    return (await fetchCart("merchants")) || [];
}

export async function setCartMerchants(merchants: Merchant[]) {
    await updateCart({ merchants });
}

export const calculateItemPrice = (item: CartItem) => {
    const price = _.get(item, "salePrice", 0) || _.get(item, "price", 0);

    return Currency(item.quantity || 1).multiply(price).value;
};

export const calculateSubtotalPrice = (items: CartItem[]): number => {
    let total = Currency(0);

    items.forEach((item) => {
        const itemPrice = calculateItemPrice(item);
        total = Currency(total).add(itemPrice);
    });

    return total.value;
};

export async function setCartSubtotalPrice(subTotalPrice: number) {
    await updateCart({ subTotalPrice });
}

export const calculateTax = (price: number, taxes: Tax[]): Tax[] => {
    return !_.isEmpty(taxes)
        ? _.map(taxes, (tax: Tax) => {
              return {
                  type: tax.type,
                  value: _.round((tax.value * price) / 100, 2),
              };
          })
        : [];
};

export async function getCartSubtotalPrice() {
    const subTotalPrice = await fetchCart("subTotalPrice");

    return Currency(subTotalPrice).value;
}

export const sumTaxObject = (tax: Tax | {}): number => {
    if (_.isEmpty(tax)) {
        return 0;
    }

    return _.reduce(
        tax,
        (sum: number, value: number) => {
            return Currency(sum).add(value).value;
        },
        0
    );
};

export const calculateItemTax = (item: CartItem, taxes: Tax[]) => {
    const itemPrice = calculateItemPrice(item);

    return item.hasTax ? calculateTax(itemPrice, taxes) : [];
};

export const calculateTotalTax = (items: CartItem[]): Tax | {} => {
    const Taxes: any = {};

    _.size(items) > 0 &&
        _.forEach(items, (item: CartItem) => {
            if (
                _.get(item, "hasTax", false) &&
                !_.isEmpty(_.get(item, "taxes", []))
            ) {
                _.map(item.taxes, (tax: Tax) => {
                    if (_.has(tax, "type")) {
                        Taxes[tax.type] = Currency(Taxes[tax.type]).add(
                            tax.value
                        ).value;
                    }
                });
            }
        });

    return Taxes;
};

export async function setCartTotalTax(totalTax: Tax | {}) {
    await updateCart({ totalTax });
}

export async function getCartTotalTax() {
    return (await fetchCart("totalTax")) || {};
}

export const calculateDeliveryDuration = (duration: number): number => {
    return _.ceil(duration / 60, 0);
};

export const calculateDeliveryDistance = (distance: number): number => {
    return _.round(distance / 1000, 2);
};

export const calculateDeliveryFee = (
    distance: number,
    base = 0,
    incrementPerKm = 2,
    incremerntPerKmPrice = 1.5
): number => {
    let fee = base;

    const km = calculateDeliveryDistance(distance);

    if (km > 3) {
        fee = Currency(km - 3)
            .divide(incrementPerKm)
            .multiply(incremerntPerKmPrice).value;
    }

    return _.round(fee, 2);
};

export const calculateTotalDeliveryFee = (merchants: Merchant[]): number => {
    if (_.isEmpty(merchants)) {
        return 0;
    }

    const fees = _.reduce(
        merchants,
        (sum: number, merchant: Merchant) => {
            const fee = _.get(merchant, "shipping.fee", 0);
            if (fee > 0) {
                sum = Currency(sum).add(fee).value;
            }

            return sum;
        },
        0
    );

    return fees;
};

export async function setCartTotalDeliveryFee(totalDeliveryFee: number) {
    await updateCart({ totalDeliveryFee });
}

export async function getCartTotalDeliveryFee() {
    const totalDeliveryFee = await fetchCart("totalDeliveryFee");

    return Currency(totalDeliveryFee).value;
}

export const calculateTotalDeliveryTip = (merchants: Merchant[]): number => {
    if (_.isEmpty(merchants)) {
        return 0;
    }

    const tip = _.reduce(
        merchants,
        (sum: number, merchant: Merchant) => {
            let tipRate = _.get(merchant, "shipping.tipRate", 0);

            if (_.toNumber(tipRate) >= 1) {
                tipRate = _.round(_.divide(tipRate, 100), 2);
            }

            if (tipRate > 0) {
                const subTotalPrice = calculateSubtotalPrice(merchant.items);

                sum = Currency(sum).add(
                    Currency(subTotalPrice).multiply(tipRate).value
                ).value;
            }

            return sum;
        },
        0
    );

    return tip;
};

export async function setCartTotalDeliveryTip(totalDeliveryTip: number) {
    await updateCart({ totalDeliveryTip });
}

export async function getCartTotalDeliveryTip() {
    const totalDeliveryTip = await fetchCart("totalDeliveryTip");

    return Currency(totalDeliveryTip).value;
}

export const itemInCart = (items: object, id: string) => {
    return _.findIndex(items, ["id", id]) > -1;
};

export const getItem = (items: object[], id: string, key: string = "") => {
    const item = _.find(items, ["id", id]) || {};

    return !key ? item : _.get(item, key, "");
};

export async function setCartCoupon(coupon: Coupon) {
    await updateCart({
        coupon: !_.isEmpty(coupon)
            ? coupon
            : {
                  id: "",
                  code: "DEFAULT_COUPON",
                  type: "amount",
                  value: 0,
              },
    });
}

export async function getCartCoupon() {
    return (
        (await fetchCart("coupon")) || {
            id: "",
            code: "DEFAULT_COUPON",
            type: "amount",
            value: 0,
        }
    );
}

export async function setCartDiscount(discount: number) {
    await updateCart({
        discount: Currency(discount).value > 0 ? Currency(discount).value : 0,
    });
}

export async function getCartDiscount() {
    const discount = await fetchCart("discount");

    return Currency(discount).value;
}

export async function setCartShippingType(value: any) {
    try {
        const data = encrypt(value);
        await setLocalState(SHIPPING_TYPE_KEY, data);
    } catch (error) {
        await setLocalState(SHIPPING_TYPE_KEY, null);
    }
}

export async function getCartShippingType() {
    try {
        const encrypted = await getLocalState(SHIPPING_TYPE_KEY);
        if (_.isNil(encrypted)) {
            return null;
        }

        return decrypt(encrypted);
    } catch (error) {
        return null;
    }
}

export async function setCartShipping(value: object) {
    try {
        const data = encrypt(value);
        await setLocalState(SHIPPING_KEY, data);
    } catch (error) {
        await setLocalState(SHIPPING_KEY, null);
    }
}

export async function getCartShipping() {
    try {
        const encrypted = await getLocalState(SHIPPING_KEY);
        if (_.isNil(encrypted)) {
            return null;
        }

        return decrypt(encrypted);
    } catch (error) {
        return null;
    }
}

export async function setCartShippingTip(value: any) {
    try {
        const data = encrypt(value);
        await setLocalState(SHIPPING_TIP_KEY, data);
    } catch (error) {
        await setLocalState(SHIPPING_TIP_KEY, null);
    }
}

export async function getCartShippingTip() {
    try {
        const encrypted = await getLocalState(SHIPPING_TIP_KEY);
        if (_.isNil(encrypted)) {
            return null;
        }

        return decrypt(encrypted);
    } catch (error) {
        return null;
    }
}

export async function setCartPaymentMethodType(value: any) {
    try {
        const data = encrypt(value);
        await setLocalState(PAYMENT_METHOD_TYPE_KEY, data);
    } catch (error) {
        await setLocalState(PAYMENT_METHOD_TYPE_KEY, null);
    }
}

export async function getCartPaymentMethodType() {
    try {
        const encrypted = await getLocalState(PAYMENT_METHOD_TYPE_KEY);
        if (_.isNil(encrypted)) {
            return null;
        }

        return decrypt(encrypted);
    } catch (error) {
        return null;
    }
}

export async function setCartPaymentMethod(value: object) {
    try {
        const data = encrypt(value);
        await setLocalState(PAYMENT_METHOD_KEY, data);
    } catch (error) {
        await setLocalState(PAYMENT_METHOD_KEY, null);
    }
}

export async function getCartPaymentMethod() {
    try {
        const encrypted = await getLocalState(PAYMENT_METHOD_KEY);
        if (_.isNil(encrypted)) {
            return null;
        }

        return decrypt(encrypted);
    } catch (error) {
        return null;
    }
}
