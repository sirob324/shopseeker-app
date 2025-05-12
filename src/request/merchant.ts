import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

export const createMerchant = (data: any) => {
    return fetch("merchant", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getMerchantByIdOrSlug = (data: any) => {
    return fetch("merchant/slug", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchant = (data: any) => {
    return fetch("merchant", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const createMerchantExecutive = (data: any) => {
    return fetch("merchant/executive", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchantExecutive = (data: any) => {
    return fetch("merchant/executive", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const createMerchantProfile = (data: any) => {
    return fetch("merchant/profile", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchantProfile = (data: any) => {
    return fetch("merchant/profile", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchantExternal = (data: any) => {
    return fetch("merchant/external", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateMerchantBrand = (data: any) => {
    return fetch("merchant/brand", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
