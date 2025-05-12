import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

export const getPayment = (data: any) => {
    return fetch("payment", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updatePayment = (data: any) => {
    return fetch("payment", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const createPaymentMethod = (data: any) => {
    return fetch("payment/method", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
