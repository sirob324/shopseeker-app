import _ from "lodash";
import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

import Config from "config";

export const searchRegion = (data: any) => {
    return fetch(Config.REST_HOST!, "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const findBySlug = (data: any = {}) => {
    return fetch("region", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const getNearbyShop = (data: any) => {
    return fetch("merchant/nearby", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
