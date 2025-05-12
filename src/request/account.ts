import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

export const createAccount = (data: any) => {
    return fetch("account", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const createCustomer = (data: any) => {
    return fetch("customer", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
