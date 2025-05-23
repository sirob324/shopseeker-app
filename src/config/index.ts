import Config from "react-native-config";

export default {
    APP_NAME: Config.APP_NAME,
    APP_VERSION: Config.APP_VERSION,
    APP_IDENTIFIER: Config.APP_IDENTIFIER,

    HOST: Config.HOST,
    MEDIA_HOST: Config.MEDIA_HOST,
    REST_HOST: Config.REST_HOST,
    IO_HOST: Config.IO_HOST,

    GOOGLE_CLIENT_ID: Config.GOOGLE_CLIENT_ID,

    STRIPE_PUBLISHABLE_KEY: Config.STRIPE_PUBLISHABLE_KEY,
    MERCHANT_IDENTIFIER: Config.MERCHANT_IDENTIFIER,

    ENCRYPT_KEY: Config.ENCRYPT_KEY,
    ENCRYPT_IV: Config.ENCRYPT_IV,

    PAYMENT_PROVIDER: Config.PAYMENT_PROVIDER,

    SUPPORT_EMAIL: Config.SUPPORT_EMAIL,
};
