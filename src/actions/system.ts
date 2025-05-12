import _ from "lodash";

import { SYSTEM } from "./types";

export function installDevice(payload: object = {}) {
    return {
        type: SYSTEM.INSTALL_DEVICE,
        payload,
    };
}

export function loadConfig(payload: object) {
    return {
        type: SYSTEM.LOAD_CONFIG,
        payload: _.isPlainObject(payload) ? payload : {},
    };
}

export function changeLocale(payload: string) {
    return {
        type: SYSTEM.CHANGE_LOCALE,
        payload,
    };
}

export function changeLocation(payload: any[]) {
    return {
        type: SYSTEM.CHANGE_LOCATION,
        payload,
    };
}

export function registerNotification(payload: object) {
    return {
        type: SYSTEM.REGISTER_NOTIFICATION,
        payload,
    };
}

export function changeStatus(payload: string) {
    return {
        type: SYSTEM.CHANGE_STATUS,
        payload,
    };
}
