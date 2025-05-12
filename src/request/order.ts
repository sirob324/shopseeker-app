import _ from "lodash";
import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

export const createOrder = (data: any) => {
    return fetch("orders", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
