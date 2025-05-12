import { Platform } from "react-native";
import _ from "lodash";
import { call, takeLatest } from "redux-saga/effects";

import Locales, { LANGUAGES } from "locales";

import { SYSTEM } from "actions/types";
import { installDevice, updateInstallation } from "helpers/parse";

const install_device = function* ({ payload }: any) {
    yield call(installDevice, payload);
};

const change_locale = function* ({ payload }: any) {
    if (_.has(LANGUAGES, payload)) {
        Locales.locale = payload;

        yield call(updateInstallation, { localeIdentifier: payload });
    }
};

const change_location = function* ({ payload }: any) {
    if (!_.isEmpty(payload)) {
        yield call(updateInstallation, {
            lat: _.get(payload, "1"),
            lng: _.get(payload, "0"),
            deviceType: Platform.OS,
        });
    }
};

const register_notification = function* ({ payload }: any) {
    if (!_.isEmpty(payload) && _.has(payload, "deviceToken")) {
        yield call(updateInstallation, {
            deviceToken: _.get(payload, "deviceToken"),
        });
    }
};

const root = function* root() {
    yield takeLatest(SYSTEM.INSTALL_DEVICE, install_device);
    yield takeLatest(SYSTEM.CHANGE_LOCALE, change_locale);
    yield takeLatest(SYSTEM.CHANGE_LOCATION, change_location);
    yield takeLatest(SYSTEM.REGISTER_NOTIFICATION, register_notification);
};

export default root;
