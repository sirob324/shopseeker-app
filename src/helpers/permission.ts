import {
    check as checkPermission,
    PERMISSIONS,
    openSettings,
} from "react-native-permissions";

import { IS_IOS } from "config/constant";

import Log from "helpers/log";

const permissions = {
    location: IS_IOS
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

export async function check(name: string) {
    switch (name) {
        case "locationn":
            return await checkPermission(permissions.location);
    }
}

export function openSetting() {
    openSettings().catch(() => Log("cannot open settings"));
}
