const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

const defaultTypes: string[] = [REQUEST, SUCCESS, FAILURE];

const createRequestTypes = (
    base: string,
    types = defaultTypes
): { [key: string]: any } => {
    const res: { [key: string]: any } = {};
    types.forEach((type: string) => (res[type] = `${base}_${type}`));
    return res;
};

export const AUTH = createRequestTypes("AUTH", [
    "SKIP_SIGNIN",
    "LOGIN_REQUEST",
    "SIGNUP_REQUEST",
    "SIGNUP_SUCCESS",
    "SIGNUP_FAILURE",
    "SIGNIN_REQUEST",
    "SIGNIN_SUCCESS",
    "SIGNIN_FAILURE",
    "SIGNOUT_REQUEST",
    "SIGNOUT_SUCCESS",
]);

export const CART = createRequestTypes("CART", [
    "REHYDRATE",
    "ADD_ITEM_REQUEST",
    "ADD_ITEM",
    "REMOVE_ITEM_REQUEST",
    "REMOVE_ITEM",
    "CLEAR_ITEM_FROM_CART",
    "CLEAR_CART",
    "APPLY_COUPON",
    "REMOVE_COUPON",
    "UPDATE_MERCHANT_REQUEST",
    "UPDATE_MERCHANTS_REQUEST",
    "UPDATE_MERCHANTS",
    "UPDATE_SUBTOTAL",
    "UPDATE_TOTAL_TAX",
    "UPDATE_TOTAL_DELIVERY_FEE",
    "UPDATE_TOTAL_DELIVERY_TIP",
]);

export const DEEP_LINKING = createRequestTypes("DEEP_LINKING", ["OPEN"]);

export const MODE = createRequestTypes("MODE", ["RUNNING", "UPDATE_STATE"]);

export const NAV = createRequestTypes("NAV", ["UPDATE_REGION", "UPDATE_TYPE"]);

export const NOTIFICATION = createRequestTypes("NOTIFICATION", [
    "REGISTER",
    "OPEN",
    "SEND",
    "INAPP_RECEIVED",
    "INAPP_REMOVE",
]);

export const PROFILE = createRequestTypes("PROFILE", [
    "INIT_PROFILE",
    "RESET_PROFILE",
    "INIT_USER",
    "UPDATE_USER",
    "UPDATE_PROVIDER",
    "INIT_ACCOUNT",
    "UPDATE_ACCOUNT",
    "INIT_MERCHANT",
    "UPDATE_MERCHANT",
    "INIT_DELIVER",
    "UPDATE_DELIVER",
    "INIT_ADDRESSES",
    "ADD_ADDRESS",
    "UPDATE_ADDRESS",
    "REMOVE_ADDRESS",
    "SET_DEFAULT_ADDRESS",
    "INIT_CARDS",
    "ADD_CARD",
    "REMOVE_CARD",
    "SET_DEFAULT_CARD",
]);

export const REGION = createRequestTypes("REGION", ["INIT", "UPDATE", "RESET"]);

export const SYSTEM = createRequestTypes("SYSTEM", [
    "INSTALL_DEVICE",
    "LOAD_CONFIG",
    "CHANGE_LOCALE",
    "CHANGE_LOCATION",
    "REGISTER_NOTIFICATION",
    "CHANGE_STATUS",
]);
