import { Linking, NativeModules, Platform } from "react-native";
import _ from "lodash";
import Parse from "parse/react-native";
import { Settings } from "react-native-fbsdk-next";
import Geolocation from "react-native-geolocation-service";
import { FOREGROUND, BACKGROUND } from "redux-enhancer-react-native-appstate";
import { put, takeLatest, select, fork, call, delay } from "redux-saga/effects";

import Config from "config";
import * as Route from "config/route";
import Notifications from "notification";
import { LANGUAGES, defaultLocale } from "locales";

import {
    loadConfig,
    changeStatus,
    changeLocale,
    changeLocation,
    registerNotification as register_notification,
} from "actions/system";
import { openNotification, registerNotification } from "actions/notification";
import { MODE } from "actions/types";
import { initRegion } from "actions/region";
import { resetProfile } from "actions/profile";
import { deepLinkingOpen } from "actions/deepLinking";

import Lib from "helpers/lib";
import { AsyncStorage } from "helpers/storage";
import { updateInstallation } from "helpers/parse";

import { findBySlug } from "request/region";

Settings.initializeSDK();

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(Config.PARSE_APP_ID, Config.PARSE_JS_KEY);
Parse.masterKey = Config.PARSE_MT_KEY;
Parse.serverURL = Config.PARSE_HOST;
Parse.enableEncryptedUser();
Parse.secret = Config.ENCRYPT_KEY;

const parseDeepLinking = (url: string | null) => {
    if (url) {
        url = url.replace(
            /shopseeker:\/\/|https:\/\/www.shopseeker.com\/|https:\/\/www.shopseeker.cn\/|https:\/\/www.shopseeker.com\/|https:\/\/www.shopseeker.com\//,
            ""
        );
        let regex = /^shop\?/;
        if (url.match(regex)) {
            url = url.replace(regex, "").trim();
            if (url) {
                return {
                    page: Route.SHOP_PAGE,
                    params: Lib.parseQuery(url),
                };
            }
        }

        regex = /^shop\//;
        if (url.match(regex)) {
            url = url.replace(regex, "").trim().split("/")[0].split("#")[0];
            if (url) {
                return {
                    page: Route.SHOP_PAGE,
                    params: { id: url },
                };
            }
        }

        regex = /^(room|auth|invite)\?/;
        if (url.match(regex)) {
            url = url.replace(regex, "").trim();
            if (url) {
                return Lib.parseQuery(url);
            }
        }

        const call = /^(https:\/\/)?jitsi.rocket.chat\//;
        if (url.match(call)) {
            url = url.replace(call, "").trim();
            if (url) {
                return { path: url, isCall: true };
            }
        }
    }

    return null;
};

const load_config = function* () {
    try {
        const { attributes } = yield Parse.Config.get();

        yield put(loadConfig(attributes));
    } catch (e) {
        yield Parse.User.logOut();
        yield put(resetProfile());
    }
};

const load_region = function* () {
    const { id, types } = yield select((state) => state.region);

    if (!!!id || _.isEmpty(types)) {
        const region = yield call(findBySlug, {});
        yield put(initRegion(region));
    }
};

const set_locale = function* () {
    const { locale } = yield select((state) => state.system);

    if (!locale) {
        const getLanguage = (data: string) => {
            if (_.has(LANGUAGES, data)) {
                return data;
            } else if (_.has(LANGUAGES, _.split(data, "-")[0])) {
                return _.split(data, "-")[0];
            }

            return "";
        };

        let deviceLocale =
            Platform.OS === "ios"
                ? NativeModules.SettingsManager.settings.AppleLocale ||
                  NativeModules.SettingsManager.settings.AppleLanguages[0]
                : NativeModules.I18nManager.localeIdentifier;

        if (deviceLocale.indexOf("ar") !== -1) {
            deviceLocale = "ar";
        } else if (deviceLocale.indexOf("en") !== -1) {
            deviceLocale = "en";
        } else if (deviceLocale.indexOf("fr") !== -1) {
            deviceLocale = "fr";
        } else if (deviceLocale.indexOf("he") !== -1) {
            deviceLocale = "he";
        } else if (deviceLocale.indexOf("it") !== -1) {
            deviceLocale = "it";
        } else if (deviceLocale.indexOf("ja") !== -1) {
            deviceLocale = "ja";
        } else if (deviceLocale.indexOf("ko") !== -1) {
            deviceLocale = "ko";
        } else if (deviceLocale.indexOf("pt-BR") !== -1) {
            deviceLocale = "pt-BR";
        } else if (deviceLocale.indexOf("pt") !== -1) {
            deviceLocale = "pt";
        } else if (deviceLocale.indexOf("ru") !== -1) {
            deviceLocale = "ru";
        } else if (deviceLocale.indexOf("zh-Hans") !== -1) {
            deviceLocale = "zh-Hans";
        } else if (
            deviceLocale.indexOf("zh") !== -1 ||
            deviceLocale.indexOf("yue") !== -1
        ) {
            deviceLocale = "zh";
        } else {
            deviceLocale = deviceLocale.substr(0, 2);
        }

        let _locale = getLanguage(deviceLocale);

        if (!_locale) {
            _locale = defaultLocale;
        }

        yield put(changeLocale(_locale));
    }
};

const getPositionSuccess = function* (position: any) {
    const { location } = yield select((state) => state.system);

    const currentLocation = [
        position.coords.longitude,
        position.coords.latitude,
    ];

    if (!_.isEqual(location, currentLocation)) {
        yield put(changeLocation(currentLocation));
    }
};

const set_location = function* () {
    yield Geolocation.requestAuthorization("whenInUse");

    Geolocation.getCurrentPosition(getPositionSuccess, () => {}, {
        enableHighAccuracy: true,
        accuracy: {
            ios: "bestForNavigation",
            android: "high",
        },
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 1,
        forceRequestLocation: true,
        showLocationDialog: true,
    });
};

const set_notification = function* () {
    const { notification } = yield select((state) => state.system);

    yield put(registerNotification());

    const isRegistered = yield Notifications.isRegistered();

    if (isRegistered) {
        if (
            Notifications.deviceToken &&
            !_.isEqual(
                _.get(notification, "deviceToken"),
                Notifications.deviceToken
            )
        ) {
            yield call(updateInstallation, {
                deviceToken: Notifications.deviceToken,
            });

            yield put(
                register_notification({
                    granted: true,
                    deviceToken: Notifications.deviceToken,
                })
            );
        }

        const badges = yield Notifications.getBadgeCount();

        if (badges) {
            yield Notifications.clearBadgeCount();
            yield Notifications.removeAllLocalNotifications();
        }
    }
    // else {
    //     yield put(registerNotification());
    // }
};

const update_state = function* ({ payload }: { payload: string }): any {
    const [notification, deepLinking] = yield Promise.all([
        Notifications.openAppFromNotification(),
        Linking.getInitialURL(),
    ]);

    const parsedDeepLinkingURL = parseDeepLinking(deepLinking);

    if (notification) {
        yield delay(10);
        yield put(openNotification(notification.payload));
    } else if (parsedDeepLinkingURL) {
        yield delay(10);
        yield put(deepLinkingOpen(parsedDeepLinkingURL));
    } else {
        // for im system
        // yield put(appInit());

        if (payload === FOREGROUND) {
            yield put(changeStatus("init"));
            yield fork(load_config);
            yield fork(load_region);
            yield fork(set_locale);
            yield fork(set_location);
            yield put(changeStatus("ready"));
            // yield fork(set_notification);
        } else if (payload === BACKGROUND) {
        }

        yield delay(5000);
        yield fork(set_notification);
    }
};

const root = function* () {
    yield takeLatest(MODE.UPDATE_STATE, update_state);
};

export default root;
