import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

import Config from "config";

export const createMerchant = (data: object) => {
    return fetch("merchant", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const createMerchantExecutive = (data: object) => {
    return fetch("merchant/executive", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchantExecutive = (data: object) => {
    return fetch("merchant/executive", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const createMerchantProfile = (data: object) => {
    return fetch("merchant/profile", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchantProfile = (data: object) => {
    return fetch("merchant/profile", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchantExternal = (data: object) => {
    return fetch("merchant/external", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchantBrand = (data: object) => {
    return fetch("merchant/brand", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getProduct = (data: object) => {
    return fetch(Config.REST_HOST!, "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getCategory = (data: object) => {
    return fetch(Config.REST_HOST!, "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const removeProductImage = (data: object) => {
    return fetch("product/image", "post", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// identity
export const getIdentify = (data: object) => {
    return fetch("merchant/identity", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateIdentity = (data: object) => {
    return fetch("merchant/identity", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// external account
export const getExternalAccount = (data: object) => {
    return fetch("merchant/external/fetch", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const addExternalAccount = (data: object) => {
    return fetch("merchant/external", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateExternalAccount = (data: object) => {
    return fetch("merchant/external", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const removeExternalAccount = (data: object) => {
    return fetch("merchant/external/remove", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// representative
export const getRepresentative = (data: object) => {
    return fetch("merchant/executive/fetch", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateRepresentative = (data: object) => {
    return fetch("merchant/executive", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// shop
export const getShop = (data: object) => {
    return fetch("merchant/shop/fetch", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateShop = (data: object) => {
    return fetch("merchant/shop", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const removeMerchantImage = (data: object) => {
    return fetch("merchant/image", "post", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// statistics
export const getSalesSummary = (data: object) => {
    return fetch("merchant/sales/summary", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getBankAccountStatus = (data: object) => {
    return fetch("merchant/status", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getBankAccountBalance = (data: object) => {
    return fetch("merchant/balance", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// pick order
export const orderForPick = (data: object) => {
    return fetch("orders/ready", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateOrderStatus = (data: object) => {
    return fetch("order/update/status", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// qrcode
export const createMerchantMiniCode = (data: object) => {
    return fetch("merchant/minicode", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getMerchantMiniCode = (data: object) => {
    return fetch("merchant/minicode/merchant", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
