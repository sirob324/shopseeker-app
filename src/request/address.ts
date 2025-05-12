import _ from "lodash";

import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

export const queryAddress = (data: object) => {
    return fetch("address/query", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const addContactAddress = (data: object) => {
    return fetch("address", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const updateContactAddress = (data: object) => {
    return fetch("address", "PUT", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const deleteContactAddress = (data: object) => {
    return fetch("address/remove", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
