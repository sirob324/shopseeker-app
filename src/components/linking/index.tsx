import { Linking } from "react-native";

import Log from "helpers/log";

const WHITELISTED_URL_SCHEMES = [
    "https:",
    "http:",
    "mailto:",
    "comgooglemaps-x-callback:",
];

const ERR_NOT_LISTED = "Linking: URL does not match whitelisted schemes";

function allowed(source: string) {
    return !!WHITELISTED_URL_SCHEMES.find((p) => source.indexOf(p) === 0);
}

export const open = async (source: string) => {
    const canOpened = await canOpen(source);

    if (!canOpened) {
        Log(ERR_NOT_LISTED + " " + source);
    }

    const res = await Linking.openURL(source);
    return res;
};

export const canOpen = async (source: string) => {
    const isAllowed = allowed(source);

    if (!isAllowed) {
        return false;
    }

    try {
        return await Linking.canOpenURL(source);
    } catch (e) {
        Log(e);

        return false;
    }
};
