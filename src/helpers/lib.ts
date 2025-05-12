import _ from "lodash";
import uuid from "react-native-uuid";

import { Linking, Alert, Platform } from "react-native";

import Toast, { ToastOptions } from "react-native-root-toast";
import Geolocation from "react-native-geolocation-service";

const crc32 = require("crc32");

import Style from "style";

import { HAS_NOTCH } from "config/constant";

let toast: any = null;

const Lib = {
    c2c: function (data: any) {
        return crc32(data.toString(), true);
    },

    orderId: function () {
        return Math.floor(Math.random() * Date.now());
    },

    uuidv1: function () {
        return uuid.v1();
    },

    uuidv4: function () {
        return uuid.v4();
    },

    getEncodeAddress: function (data: any) {
        return Lib.getAddress(data, true);
    },

    getAddress: function (data: any, encode?: boolean) {
        let address = "";

        if (_.isString(data)) {
            address = data;
        } else if (_.isPlainObject(data)) {
            let str = "";
            if (_.get(data, "line2", "")) {
                str += data.line2 + "-";
            }

            if (_.get(data, "line1", "")) {
                str += data.line1 + ", ";
            }

            if (_.get(data, "city", "")) {
                str += data.city + ", ";
            }

            if (_.get(data, "state", "")) {
                str += data.state + ", ";
            }

            if (_.get(data, "country", "")) {
                str += data.country + " ";
            }

            if (_.get(data, "postal_code", "")) {
                str += data.postal_code;
            }

            address = str;
        } else if (_.isArray(data)) {
            address = _.join(data, ",");
        }

        return encode ? encodeURIComponent(address) : address;
    },

    getMap: (address: any) => {
        const _address = Lib.getAddress(address);

        const googleApp =
            "comgooglemaps-x-callback://?q=" +
            _address +
            "&x-success=shopseeker://&x-source=ShopSeeker";

        const googleWeb = "https://www.google.com/maps/?q=" + _address;

        const appleMap = "https://maps.apple.com/?q=" + _address;

        return {
            googleApp,
            googleWeb,
            appleMap,
        };
    },

    getDirection: (from: any, to: any) => {
        const _from = Lib.getAddress(from);
        const _to = Lib.getAddress(to);

        const googleApp = `comgooglemaps-x-callback:\/\/?saddr=${_from}&daddr=${_to}&directionsmode=driving&zoom=17&x-success=shopseeker&x-source=ShopSeeker`;

        const googleWeb = `https://www.google.com/maps/?saddr=${_from}&daddr=${_to}&directionsmode=driving&zoom=17&x-success=shopseeker&x-source=ShopSeeker`;

        const appleMap = `https://maps.apple.com/?saddr=${_from}&daddr=${_to}&dirflg=d`;

        return {
            googleApp,
            googleWeb,
            appleMap,
        };
    },

    getCurrentPosition: () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        return new Promise((resolve, reject) =>
            Geolocation.getCurrentPosition(resolve, reject, options)
        );
    },

    isValidEmail: function (email: string) {
        const reg =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return reg.test(email);
    },

    showToast: function (
        message: string,
        options: ToastOptions & {
            style?: any;
            onClose?: any;
            textStyle?: any;
        } = {}
    ) {
        const {
            duration = 1000,
            delay = 0,
            position = HAS_NOTCH ? 50 : 30,
            animation = true,
            hideOnPress = true,
            shadow = true,
            shadowColor = Style.bg_color_light.backgroundColor,
            opacity = 1,
            textStyle = {},
            keyboardAvoiding = true,
            style = {},
            onShow,
            onClose,
            onPress,
            onHidden,
            onShown,
        } = options;

        const onHide = onClose || undefined;

        toast = Toast.show(message, {
            containerStyle: {
                ...Style.bg_color_15,
                ...Style.p_3,
                ...Style.v_center,
                ...style,
            },
            duration,
            position,
            animation,
            shadow,
            opacity,
            shadowColor,
            textStyle: {
                color: Style.f_color_dark_bold.color,
                fontSize: Style.f_size_13.fontSize,
                fontWeight: Style.f_weight_500.fontWeight,
                ...textStyle,
            },
            delay,
            keyboardAvoiding,
            hideOnPress,
            onHide,
            onHidden,
            onShow,
            onShown,
            onPress,
        });
    },

    hideToast: function () {
        Toast.hide(toast);
    },

    chunkStr: function (string: string, size: number) {
        return _.join(
            _.toString(string).match(new RegExp(".{1," + size + "}", "g")),
            "-"
        );
    },

    encode: function (input: string) {
        try {
            return encodeURIComponent(input);
        } catch (e) {
            return null;
        }
    },

    decode: function (input: string) {
        try {
            return decodeURIComponent(input.replace(/\+/g, " "));
        } catch (e) {
            return null;
        }
    },

    querystring: function (query: string) {
        query = decodeURIComponent(query);
        query =
            query.indexOf("?") > -1
                ? query.substring(query.indexOf("?"))
                : query;

        var parser = /([^=?#&]+)=?([^&]*)/g,
            result: any = {},
            part;

        while ((part = parser.exec(query))) {
            var key = this.decode(part[1]),
                value = this.decode(part[2]);

            if (key === null || value === null || key in result) continue;
            result[key] = value;
        }

        return result;
    },

    parseQuery: function (query: string) {
        return (/^[?#]/.test(query) ? query.slice(1) : query)
            .split("&")
            .reduce((params: any, param) => {
                const [key, value] = param.split("=");
                params[key] = value
                    ? decodeURIComponent(value.replace(/\+/g, " "))
                    : "";
                return params;
            }, {});
    },

    getClientIp: function (req: any) {
        if (req.headers["x-forwarded-for"]) {
            // try to get from x-forwared-for if it set (behind reverse proxy)
            return req.headers["x-forwarded-for"].split(",")[0];
        } else if (req.connection && req.connection.remoteAddress) {
            // no proxy, try getting from connection.remoteAddress
            return req.connection.remoteAddress;
        } else if (req.socket) {
            // try to get it from req.socket
            return req.socket.remoteAddress;
        } else if (req.connection && req.connection.socket) {
            // try to get it form the connection.socket
            return req.connection.socket.remoteAddress;
        } else {
            // if non above, fallback.
            return req.ip;
        }
    },

    phone: function (phone: string) {
        let phoneNumber = phone;
        if (Platform.OS !== "android") {
            phoneNumber = `telprompt:${phone}`;
        } else {
            phoneNumber = `tel:${phone}`;
        }

        Linking.canOpenURL(phoneNumber)
            .then((supported) => {
                if (!supported) {
                    Alert.alert("Phone number is not available");
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch((e) => _);
    },
};

export default Lib;
