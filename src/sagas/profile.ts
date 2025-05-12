import _ from "lodash";
import { put, takeLatest, call } from "redux-saga/effects";

import { PROFILE } from "actions/types";
import {
    initUser,
    initAccount,
    initAddresses,
    initCards,
} from "actions/profile";

import {
    removeAuth,
    setAccountAuth,
    updateAccountAuth,
    setUserAuth,
    updateUserAuth,
    setAddressesAuth,
    addAddressesAuth,
    updateAddressesAuth,
    removeAddressesAuth,
    setAddressesDefaultAuth,
    setCardsAuth,
    addCardsAuth,
    removeCardsAuth,
    setCardsDefaultAuth,
    setProviderAuth,
} from "helpers/profile";

const set_default_card = function* ({ payload }: { payload: any }) {
    yield call(setCardsDefaultAuth, payload);
};

const remove_card = function* ({ payload }: { payload: any }) {
    yield call(removeCardsAuth, payload);
};

const add_card = function* ({ payload }: { payload: any }) {
    yield call(addCardsAuth, payload);
};

const init_cards = function* ({ payload }: { payload: any }) {
    yield call(setCardsAuth, payload);
};

const set_default_address = function* ({ payload }: { payload: any }) {
    yield call(setAddressesDefaultAuth, payload);
};

const remove_address = function* ({ payload }: { payload: any }) {
    yield call(removeAddressesAuth, payload);
};

const update_address = function* ({ payload }: { payload: any }) {
    yield call(updateAddressesAuth, payload);
};

const add_address = function* ({ payload }: { payload: any }) {
    yield call(addAddressesAuth, payload);
};

const init_addresses = function* ({ payload }: { payload: any }) {
    yield call(setAddressesAuth, payload);
};

const update_account = function* ({ payload }: { payload: any }) {
    yield call(updateAccountAuth, payload);
};

const init_account = function* ({ payload }: { payload: any }) {
    yield call(setAccountAuth, payload);
};

const update_user = function* ({ payload }: { payload: any }) {
    yield call(updateUserAuth, payload);
};

const init_user = function* ({ payload }: { payload: any }) {
    yield call(setUserAuth, payload);
};

const reset_profile = function* () {
    yield call(removeAuth);
};

const init_profile = function* ({ payload }: { payload: any }) {
    if (payload.hasOwnProperty("user")) {
        yield put(initUser(payload.user));
    }

    if (payload.hasOwnProperty("account")) {
        yield put(initAccount(payload.account));
    }

    if (payload.hasOwnProperty("addresses")) {
        yield put(initAddresses(payload.addresses));
    }

    if (payload.hasOwnProperty("cards")) {
        yield put(initCards(payload.cards));
    }
};

const update_provider = function* ({ payload }: { payload: any }) {
    yield call(setProviderAuth, payload);
};

const root = function* root() {
    yield takeLatest(PROFILE.INIT_PROFILE, init_profile);

    yield takeLatest(PROFILE.INIT_USER, init_user);
    yield takeLatest(PROFILE.UPDATE_USER, update_user);

    yield takeLatest(PROFILE.INIT_ACCOUNT, init_account);
    yield takeLatest(PROFILE.UPDATE_ACCOUNT, update_account);

    yield takeLatest(PROFILE.INIT_ADDRESSES, init_addresses);
    yield takeLatest(PROFILE.ADD_ADDRESS, add_address);
    yield takeLatest(PROFILE.UPDATE_ADDRESS, update_address);
    yield takeLatest(PROFILE.REMOVE_ADDRESS, remove_address);
    yield takeLatest(PROFILE.SET_DEFAULT_ADDRESS, set_default_address);

    yield takeLatest(PROFILE.INIT_CARDS, init_cards);
    yield takeLatest(PROFILE.ADD_CARD, add_card);
    yield takeLatest(PROFILE.REMOVE_CARD, remove_card);
    yield takeLatest(PROFILE.SET_DEFAULT_CARD, set_default_card);

    yield takeLatest(PROFILE.UPDATE_PROVIDER, update_provider);

    yield takeLatest(PROFILE.RESET_PROFILE, reset_profile);
};

export default root;
