import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

import Config from "config";

export const getMerchant = (data: any) => {
    return fetch(Config.REST_HOST, "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
