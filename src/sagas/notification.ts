import _ from "lodash";
import { put, takeLatest } from "redux-saga/effects";

import {
    Notification,
    RegistrationError,
    NotificationCompletion,
    NotificationBackgroundFetchResult,
} from "react-native-notifications";
import { NotificationActionResponse } from "react-native-notifications/lib/dist/interfaces/NotificationActionResponse";

import * as Route from "config/route";

import { NOTIFICATION } from "actions/types";
import { registerNotification } from "actions/system";
import { openNotification } from "actions/notification";

import { redirectToShop, redirectToOrderDetail } from "utils/navigation";

import Notifications from "notification";

const open = function* ({ payload }: any) {
    const { page, params } = payload;

    switch (page) {
        case Route.ORDER_DETAIL_PAGE:
            redirectToOrderDetail(params);
            break;

        case Route.SHOP_PAGE:
            redirectToShop(params);
            break;
    }

    return;
};

const registerDeviceTokenSuccess = function* (deviceToken: string) {
    yield put(
        registerNotification({
            granted: true,
            deviceToken,
        })
    );
};

const registerDeviceTokenFail = function* (event: RegistrationError) {
    yield put(
        registerNotification({
            granted: false,
        })
    );
};

const onReceivedForeground = function* (
    notification: Notification,
    completion: (response: NotificationCompletion) => void
) {
    Notifications.sendLocalNotification(notification);

    completion({
        alert: true,
        sound: false,
        badge: false,
    });
};

const onReceivedBackground = (
    notification: Notification,
    completion: (response: NotificationBackgroundFetchResult) => void
) => {
    Notifications.sendLocalNotification(notification);

    if (notification) {
        completion(NotificationBackgroundFetchResult.NEW_DATA);
    } else if (_.isEmpty(notification)) {
        completion(NotificationBackgroundFetchResult.NO_DATA);
    } else {
        completion(NotificationBackgroundFetchResult.FAILED);
    }
};

const onOpened = function* (
    notification: Notification,
    completion: () => void,
    actionResponse?: NotificationActionResponse
) {
    yield put(openNotification(notification.payload));

    completion();
};

const register = function* () {
    Notifications.register(
        registerDeviceTokenSuccess,
        registerDeviceTokenFail,
        onReceivedForeground,
        onReceivedBackground,
        onOpened
    );
};

const root = function* () {
    yield takeLatest(NOTIFICATION.REGISTER, register);
    yield takeLatest(NOTIFICATION.OPEN, open);
};

export default root;
