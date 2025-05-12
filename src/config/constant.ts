import { Platform, Dimensions } from "react-native";
import DeviceInfo from "react-native-device-info";
import RNConfigReader from "react-native-config-reader";

export const IS_IOS = Platform.OS === "ios";

export const IS_ANDROID = Platform.OS === "android";

export const IS_TABLET = DeviceInfo.isTablet;

export const HAS_NOTCH = DeviceInfo.hasNotch();

export const DEVICE_WIDTH = Dimensions.get("window").width;

export const DEVICE_HEIGHT = Dimensions.get("window").height;

export const WINDOW_WIDTH = Dimensions.get("window").width;

export const WINDOW_HEIGHT = Dimensions.get("window").height;

export const THEME_MODE = "light";

export const STATUS_BAR_HEIGHT = 44;

export const MENU_BUTTON_WIDTH = 87;

export const MENU_BUTTON_HEIGHT = 32;

export const MENU_BUTTON_TOP = 48;

export const MENU_BUTTON_BOTTOM = MENU_BUTTON_TOP - STATUS_BAR_HEIGHT;

export const MENU_BUTTON_RIGHT = 7;

export const NAVIGATION_BAR_WIDTH = "100vw";

export const NAVIGATION_BAR_HEIGHT =
    MENU_BUTTON_BOTTOM * 2 + MENU_BUTTON_HEIGHT + STATUS_BAR_HEIGHT;

export const DEVICE_LANGUAGE = "en";

/* ================================ */

export const FETCH_LIMIT: number = 50;

export const PASSWORD_MIN_LENGTH: number = 8;

export const SEARCH_BAR_HEIGHT = 50;

export const HEADER_BAR_HEIGHT = 50;

export const FOOTER_BAR_HEIGHT = 60;

export const INPUT_HEIGHT = 40;
export const TEXTAREA_HEIGHT = 130;

export const TOKEN_KEY = "token";

export const AUTH_KEY = "_SEU_PE";

export const LOGIN_REDIRECT_KEY = "__RETU__";

export const CART_KEY = "__SEC_UIYHF__";

export const SHIPPING_TYPE_KEY = "__UR_PWLK__";

export const SHIPPING_KEY = "__ODJY__";

export const SHIPPING_TIP_KEY = "__KJRI__ESDP__";

export const PAYMENT_METHOD_TYPE_KEY = "IYB__YEU";

export const PAYMENT_METHOD_KEY = "ISJH__SKIO";

export const MAX_FILES_UPLOAD = 4;

export const MAX_SIZE_UPLOAD = 3145728;

export const ADS_HEIGHT = 130;

export const IMG_WIDTH = 120;

export const IMG_HEIGHT = 120;

export const PORTRAIT_SAFE_AREA_INSET_BOTTOM = 34;
export const LANDSCAPE_SAFE_AREA_INSET_BOTTOM = 21;
export const LANDSCAPE_SAFE_AREA_INSET_LEFT = 44;

export const isFDroidBuild = RNConfigReader.FDROID_BUILD;
export const isOfficial = RNConfigReader.IS_OFFICIAL;
