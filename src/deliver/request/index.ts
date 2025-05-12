import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

export const createDeliver = (data: object) => {
    return fetch("deliver", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// identity
export const getIdentify = (data: object) => {
    return fetch("deliver/identity", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateIdentity = (data: object) => {
    return fetch("deliver/identity", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// external account
export const getExternalAccount = (data: object) => {
    return fetch("deliver/external/fetch", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const addExternalAccount = (data: object) => {
    return fetch("deliver/external", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateExternalAccount = (data: object) => {
    return fetch("deliver/external", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const removeExternalAccount = (data: object) => {
    return fetch("deliver/external/remove", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

// delivery
export const deliveryForPickup = (data: object) => {
    return fetch("deliveries/ready", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const pickupDelivery = (data: object) => {
    return fetch("deliveries/pickup", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateDeliveryStatus = (data: object) => {
    return fetch("deliveries/update/status", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getDeliveryDetail = (data: object) => {
    return fetch("delivery", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getDeliverySummary = (data: object) => {
    return fetch("deliver/delivery/summary", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getBankAccountStatus = (data: object) => {
    return fetch("deliver/status", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getBankAccountBalance = (data: object) => {
    return fetch("deliver/balance", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
