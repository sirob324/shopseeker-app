import Config from "config";

export const HOST = Config.HOST;

export const MAIN_STACK = "MainStack";
export const DELIVER_IDENTITY_STACK = "DeliverIdentityStack";
export const MERCHANT_IDENTITY_STACK = "MerchantIdentityStack";

export const APP_PAGE = "HomePage";
export const SHOP_PAGE = "ShopPage";
export const MERCHANT_PAGE = "MerchantPage";
export const DELIVER_PAGE = "DeliverPage";

export const ORDER_DETAIL_PAGE = "OrderDetailPage";
export const DELIVERY_DETAIL_PAGE = "DeliveryDetailPage";

export const CATEGORY_ADD_PAGE = "CategoryAddPage";
export const CATEGORY_UPDATE_PAGE = "CategoryUpdatePage";

export const PRODUCT_ADD_PAGE = "ProductAddPage";
export const PRODUCT_UPDATE_PAGE = "ProductUpdatePage";

export const API_SIGNIN = `${HOST}/auth/signin`;
export const API_SIGNUP = `${HOST}/auth/signup`;
export const API_RESET_PASSWORD = `${HOST}/auth/reset-password`;
export const API_FORGOT_PASSWORD = `${HOST}/auth/forgot-password`;

export const TERMS_PAGE = "TermsPage";
export const PRIVACY_PAGE = "PrivacyPage";
export const IDENTITY_PAGE = "IdentityPage";
export const SIGNIN_PAGE = "SigninPage";
export const SIGNUP_PAGE = "SignupPage";
export const FORGOT_PASSWORD_PAGE = "ForgotPasswordPage";

export const PROFILE_PAGE = "ProfilePage";
export const CART_PAGE = "CartPage";

export const WEB_TERMS_PAGE = `${HOST}/terms`;
export const WEB_PRIVACY_PAGE = `${HOST}/privacy`;
