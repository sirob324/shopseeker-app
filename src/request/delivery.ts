import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

export const distance = (data: object) => {
    return fetch("delivery/distance", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
