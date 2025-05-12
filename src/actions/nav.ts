import { NAV } from "./types";
import { Nav } from "interfaces/nav";

export function updateNavRegion(data: Nav) {
    return {
        type: NAV.UPDATE_REGION,
        payload: data,
    };
}

export function updateNavType(data: Nav) {
    return {
        type: NAV.UPDATE_TYPE,
        payload: data,
    };
}
