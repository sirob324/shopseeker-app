import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

import { API_FORGOT_PASSWORD, API_RESET_PASSWORD } from "config/route";

export const me = (data: object) => {
    return fetch("user/me", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const forgotPassword = (email: string) => {
    return fetch(API_FORGOT_PASSWORD, "POST", {
        ie: true,
        data: encrypt({ email }).toString(),
    });
};

export const resetPassword = (data: object) => {
    return fetch(API_RESET_PASSWORD, "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
