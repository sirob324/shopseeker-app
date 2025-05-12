import { takeLatest, select, put, call } from "redux-saga/effects";
import _ from "lodash";

import { CART } from "actions/types";
import {
    addItem,
    removeItem,
    updateMerchantsRequest,
    updateMerchants,
    updateSubtotal,
    updateTotalTax,
    updateTotalDeliveryFee,
    updateTotalDeliveryTip,
} from "actions/cart";

import {
    setCartItems,
    setCartMerchants,
    calculateSubtotalPrice,
    setCartSubtotalPrice,
    calculateItemTax,
    calculateTotalTax,
    setCartTotalTax,
    calculateTotalDeliveryFee,
    setCartTotalDeliveryFee,
    calculateTotalDeliveryTip,
    setCartTotalDeliveryTip,
    setCartShippingType,
    setCartShipping,
} from "helpers/cart";
import { CartItem, Merchant } from "interfaces/cart";

const setPrice = function* () {
    const { items, merchants } = yield select((state) => state.cart);

    // calc sub total price
    const subTotalPrice = calculateSubtotalPrice(items);
    yield put(updateSubtotal(subTotalPrice));
    yield call(setCartSubtotalPrice, subTotalPrice);

    // calc total tax price
    const taxes = calculateTotalTax(items);
    yield put(updateTotalTax(taxes));
    yield call(setCartTotalTax, taxes);

    // calc total delivery fee
    const totalDeliveryFee = calculateTotalDeliveryFee(merchants);
    yield put(updateTotalDeliveryFee(totalDeliveryFee));
    yield call(setCartTotalDeliveryFee, totalDeliveryFee);

    // calc total delivery tip
    const totalDeliveryTip = calculateTotalDeliveryTip(merchants);
    yield put(updateTotalDeliveryTip(totalDeliveryTip));
    yield call(setCartTotalDeliveryTip, totalDeliveryTip);
};

const add_item_request = function* ({ payload }: { payload: CartItem }) {
    const { items } = yield select((state) => state.cart);

    if (_.isEmpty(items)) {
        payload.taxes = calculateItemTax(
            payload,
            _.get(payload, "merchant.region.taxes", [])
        );

        yield put(addItem([payload]));

        yield call(setCartItems, [payload]);
    } else {
        const res = _.map(items, (item: CartItem) => {
            if (_.has(item, "id") && item.id === payload.id) {
                const newQuantity = item.quantity + payload.quantity;
                const newItem = { ...item, quantity: newQuantity };
                newItem.taxes = calculateItemTax(
                    newItem,
                    _.get(newItem, "merchant.region.taxes", [])
                );

                return newItem;
            } else {
                return item;
            }
        });

        const index = _.findIndex(res, ["id", payload.id]);

        if (index === -1) {
            payload.taxes = calculateItemTax(
                payload,
                _.get(payload, "merchant.region.taxes", [])
            );

            res.push(payload);
        }

        yield put(addItem(res));

        yield call(setCartItems, res);
    }

    yield put(updateMerchantsRequest());

    yield call(setPrice);
};

const remove_item_request = function* ({ payload }: { payload: CartItem }) {
    const { items } = yield select((state) => state.cart);

    const res = _.reduce(
        items,
        (data: CartItem[], item: CartItem) => {
            if (_.has(item, "id") && item.id === payload.id) {
                const newQuantity = item.quantity - payload.quantity;

                if (newQuantity > 0) {
                    const newItem = { ...item, quantity: newQuantity };

                    newItem.taxes = calculateItemTax(
                        newItem,
                        _.get(newItem, "merchant.region.taxes", [])
                    );

                    return [...data, newItem];
                } else {
                    return [...data];
                }
            }

            return [...data, item];
        },
        []
    );

    yield put(removeItem(res));

    yield call(setCartItems, res);

    yield put(updateMerchantsRequest());

    yield call(setPrice);
};

const clear_item_from_cart = function* () {
    const { items } = yield select((state) => state.cart);

    yield call(setCartItems, items);

    yield put(updateMerchantsRequest());

    yield call(setPrice);
};

const update_merchant_request = function* ({ payload }: { payload: Merchant }) {
    const { merchants } = yield select((state) => state.cart);

    if (!_.isEmpty(merchants)) {
        const res = _.map(merchants, (merchant: Merchant) => {
            if (_.has(merchant, "id") && merchant.id === payload.id) {
                return {
                    ...merchant,
                    ...payload,
                };
            } else {
                return merchant;
            }
        });

        yield put(updateMerchants(res));

        yield call(setCartMerchants, res);

        yield call(setPrice);
    } else {
        yield put(updateMerchants([]));

        yield call(setCartMerchants, []);

        yield call(setPrice);
    }
};

const update_merchants_request = function* () {
    const { items } = yield select((state) => state.cart);

    if (!_.isEmpty(items)) {
        const res = _.reduce(
            items,
            (data: Merchant[], item: CartItem) => {
                const merchant = _.get(item, "merchant");

                const newItem: any = _.omit(item, "merchant");

                const index = _.findIndex(data, ["id", merchant.id]);

                if (index > -1) {
                    data[index].items.push(newItem);
                } else {
                    data.push({
                        ...merchant,
                        items: [newItem],
                    });
                }

                return [...data];
            },
            []
        );

        yield put(updateMerchants(res));

        yield call(setCartMerchants, res);

        yield call(setPrice);
    } else {
        yield put(updateMerchants([]));

        yield call(setCartMerchants, []);

        yield call(setPrice);
    }
};

const clear_cart = function* () {
    yield setCartShippingType("");
    yield setCartShipping({});
};

const root = function* root() {
    yield takeLatest(CART.ADD_ITEM_REQUEST, add_item_request);
    yield takeLatest(CART.REMOVE_ITEM_REQUEST, remove_item_request);
    yield takeLatest(CART.CLEAR_ITEM_FROM_CART, clear_item_from_cart);
    yield takeLatest(CART.UPDATE_MERCHANT_REQUEST, update_merchant_request);
    yield takeLatest(CART.UPDATE_MERCHANTS_REQUEST, update_merchants_request);
    yield takeLatest(CART.CLEAR_CART, clear_cart);
};

export default root;
