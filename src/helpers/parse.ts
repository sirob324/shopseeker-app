import { Platform } from "react-native";
import _ from "lodash";
import dayjs from "dayjs";
import Parse from "parse/react-native";
import DeviceInfo from "react-native-device-info";

import Config from "config";

import ShopHistory from "lib/parse/model/history";

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = dayjs.tz.guess() || "";

export async function getInstallationId() {
    try {
        const installationId = await Parse._getInstallationId();

        return installationId;
    } catch (e) {}
}

export async function installDevice(data: object = {}) {
    const installationId = await getInstallationId();

    const installation = new Parse.Installation({
        timeZone: timeZone,
        installationId,
        channels: [],
        appName: Config.APP_NAME,
        appVersion: Config.APP_VERSION + "",
        appIdentifier: Config.APP_IDENTIFIER,
        pushType: Platform.OS ? "apn" : "gcm",
        parseVersion: Parse.CoreManager.get("VERSION"),
        deviceType: _.toLower(Platform.OS),
        osType: _.toLower(DeviceInfo.getSystemName()),
        osVersion: DeviceInfo.getSystemVersion(),
        platformType: _.toLower(DeviceInfo.getModel()),
        platformVersion: _.toLower(DeviceInfo.getDeviceId()),
        ua: await DeviceInfo.getUserAgent(),
        extra: {
            AndroidId: await DeviceInfo.getAndroidId(),
            ApiLevel: await DeviceInfo.getApiLevel(),
            Carrier: await DeviceInfo.getCarrier(),
            Device: await DeviceInfo.getDevice(),
            DeviceName: await DeviceInfo.getDeviceName(),
            Display: await DeviceInfo.getDisplay(),
            FirstInstallTime: await DeviceInfo.getFirstInstallTime(),
            FontScale: await DeviceInfo.getFontScale(),
            Host: await DeviceInfo.getHost(),
            IpAddress: await DeviceInfo.getIpAddress(),
            MacAddress: await DeviceInfo.getMacAddress(),
            PhoneNumber: await DeviceInfo.getPhoneNumber(),
            hasGms: await DeviceInfo.hasGms(),
            hasHms: await DeviceInfo.hasHms(),
            isEmulator: await DeviceInfo.isEmulator(),
            isLocationEnabled: await DeviceInfo.isLocationEnabled(),
            isPinOrFingerprintSet: await DeviceInfo.isPinOrFingerprintSet(),
            UniqueId: DeviceInfo.getUniqueId(),
            Brand: DeviceInfo.getBrand(),
            DeviceType: DeviceInfo.getDeviceType(),
            Model: DeviceInfo.getModel(),
            Version: DeviceInfo.getVersion(),
            hasNotch: DeviceInfo.hasNotch(),
            isTablet: DeviceInfo.isTablet(),
        },
        ...data,
    });

    await installation.save();
}

export async function updateInstallation(payload: object) {
    if (!_.isEmpty(payload)) {
        await installDevice(payload);
    }
}

export const enterShopHistory = async (shop: any, uuid = "") => {
    const installationId = await getInstallationId();

    await ShopHistory.findAndSave(
        { installationId, shopId: shop.id },
        {
            installationId,
            uuid,
            shopId: _.get(shop, "id", ""),
            ..._.pick(shop, ["name", "intro", "logo", "banner"]),
            ..._.omit(shop.region, ["id", "coordinates", "mileage"]),
            lat: _.get(shop, "coordinates.1"),
            lng: _.get(shop, "coordinates.0"),
            regionId: _.get(shop, "region.id", ""),
            typeId: _.get(shop, "type.id", ""),
        }
    );
};

export const getShopHistory = async (condition: object) => {
    const installationId = await getInstallationId();

    const shops = await ShopHistory.findAll({
        ...condition,
        where: {
            ..._.get(condition, "where", {}),
            installationId,
        },
    });

    const data = _.isEmpty(shops)
        ? []
        : _.map(shops, (shop: any) => {
              const data = _.pick(
                  shop.attributes,
                  _.get(condition, "select", [])
              );

              return {
                  ..._.omit(data, ["shopId"]),
                  id: data.shopId,
              };
          });

    return data;
};
