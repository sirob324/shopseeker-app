import { takeLatest } from "redux-saga/effects";

import * as Route from "config/route";

import { DEEP_LINKING } from "actions/types";

import { redirectToShop, redirectToOrderDetail } from "utils/navigation";

const open = function* ({ payload }: any) {
    const { page, params } = payload;

    switch (page) {
        case Route.ORDER_DETAIL_PAGE:
            redirectToOrderDetail(params);
            break;

        case Route.SHOP_PAGE:
            redirectToShop(params);
            break;
    }
};

const root = function* root() {
    yield takeLatest(DEEP_LINKING.OPEN, open);
};

export default root;
