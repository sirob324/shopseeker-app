import { NOTIFICATION } from "./types";

export function registerNotification() {
    return {
        type: NOTIFICATION.REGISTER,
    };
}

export function openNotification(payload: object) {
    return {
        type: NOTIFICATION.OPEN,
        payload,
    };
}

export function sendNotification(payload: object) {
    return {
        type: NOTIFICATION.SEND,
        payload,
    };
}

export function showInAppNotification(payload: object) {
    return {
        type: NOTIFICATION.INAPP_RECEIVED,
        payload,
    };
}

export function removeNotification() {
    return {
        type: NOTIFICATION.INAPP_REMOVE,
    };
}
