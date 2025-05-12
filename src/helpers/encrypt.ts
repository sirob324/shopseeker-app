import CryptoJS from "react-native-crypto-js";

import Config from "config";

const key = CryptoJS.enc.Utf8.parse(Config.ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(Config.ENCRYPT_IV);

export function encrypt(message: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(message), key, { iv: iv, mode: CryptoJS.mode.CBC }).toString();
}

export function decrypt(message: any) {
    const decrypted = CryptoJS.AES.decrypt(message, key, { iv: iv, mode: CryptoJS.mode.CBC }).toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
}
