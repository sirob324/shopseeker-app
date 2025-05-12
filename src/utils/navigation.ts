import {
    MAIN_STACK,
    DELIVER_IDENTITY_STACK,
    MERCHANT_IDENTITY_STACK,
    APP_PAGE,
    IDENTITY_PAGE,
    SHOP_PAGE,
    ORDER_DETAIL_PAGE,
    DELIVERY_DETAIL_PAGE,
    CATEGORY_ADD_PAGE,
    CATEGORY_UPDATE_PAGE,
    PRODUCT_ADD_PAGE,
    PRODUCT_UPDATE_PAGE,
} from "config/route";

import { navigate, goBack } from "navigation";

export const redirectToApp = (params: object = {}) => {
    navigate(MAIN_STACK, {
        screen: APP_PAGE,
        params,
    });
};

export const redirectToDeliverIdentity = () => {
    navigate(DELIVER_IDENTITY_STACK, {
        screen: IDENTITY_PAGE,
    });
};

export const redirectToMerchantIdentity = () => {
    navigate(MERCHANT_IDENTITY_STACK, {
        screen: IDENTITY_PAGE,
    });
};

export const redirectToShop = (params: object = {}) => {
    navigate(MAIN_STACK, {
        screen: SHOP_PAGE,
        params,
    });
};

export const redirectToOrderDetail = (item: object) => {
    navigate(MAIN_STACK, {
        screen: ORDER_DETAIL_PAGE,
        params: { item },
    });
};

export const redirectToCategoryAdd = (params: object) => {
    navigate(MAIN_STACK, {
        screen: CATEGORY_ADD_PAGE,
        params,
    });
};

export const redirectToCategoryUpdate = (params: object) => {
    navigate(MAIN_STACK, {
        screen: CATEGORY_UPDATE_PAGE,
        params,
    });
};

export const redirectToProductAdd = (params: object) => {
    navigate(MAIN_STACK, {
        screen: PRODUCT_ADD_PAGE,
        params,
    });
};

export const redirectToProductUpdate = (params: object) => {
    navigate(MAIN_STACK, {
        screen: PRODUCT_UPDATE_PAGE,
        params,
    });
};

export const redirectToDeliveryDetail = (item: object) => {
    navigate(DELIVERY_DETAIL_PAGE, { item });
};

export const goToBack = goBack;
