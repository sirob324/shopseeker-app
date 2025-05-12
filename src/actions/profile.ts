import _ from "lodash";

import { PROFILE } from "./types";

import {
    User,
    Provider,
    Account,
    Contact,
    Card,
    Merchant,
    Deliver,
} from "interfaces/profile";

export function initProfile(data: any) {
    let payload = {};

    if (!_.isEmpty(data)) {
        payload = {
            account: {
                id: data.id,
                avatar: data.avatar || "",
                gender: data.gender || "",
                dob: data.dob || "",
                hometown: data.hometown || "",
                first_name: data.first_name || "",
                last_name: data.last_name || "",
            },
            addresses: data.addresses,
            cards: data.cards,
        };
    }

    return {
        type: PROFILE.INIT_PROFILE,
        payload,
    };
}

export function resetProfile() {
    return {
        type: PROFILE.RESET_PROFILE,
    };
}

export function initUser(data: User) {
    return {
        type: PROFILE.INIT_USER,
        payload: data,
    };
}

export function updateUser(data: User) {
    return {
        type: PROFILE.UPDATE_USER,
        payload: data,
    };
}

export function updateProvider(data: Provider | {}) {
    return {
        type: PROFILE.UPDATE_PROVIDER,
        payload: data,
    };
}

export function initAccount(data: Account) {
    return {
        type: PROFILE.INIT_ACCOUNT,
        payload: data,
    };
}

export function updateAccount(data: Account) {
    return {
        type: PROFILE.UPDATE_ACCOUNT,
        payload: data,
    };
}

export function initMerchant(data: Merchant) {
    return {
        type: PROFILE.INIT_MERCHANT,
        payload: data,
    };
}

export function updateMerchant(data: Merchant) {
    return {
        type: PROFILE.UPDATE_MERCHANT,
        payload: data,
    };
}

export function initDeliver(data: Deliver) {
    return {
        type: PROFILE.INIT_DELIVER,
        payload: data,
    };
}

export function updateDeliver(data: Deliver) {
    return {
        type: PROFILE.UPDATE_DELIVER,
        payload: data,
    };
}

export function initAddresses(data: Contact[]) {
    return {
        type: PROFILE.INIT_ADDRESSES,
        payload: data,
    };
}

export function addAddress(data: Contact) {
    return {
        type: PROFILE.ADD_ADDRESS,
        payload: data,
    };
}

export function updateAddress(data: Contact) {
    return {
        type: PROFILE.UPDATE_ADDRESS,
        payload: data,
    };
}

export function removeAddress(data: Contact) {
    return {
        type: PROFILE.REMOVE_ADDRESS,
        payload: data,
    };
}

export function setDefaultAddress(data: Contact) {
    return {
        type: PROFILE.SET_DEFAULT_ADDRESS,
        payload: data,
    };
}

export function initCards(data: Card[]) {
    return {
        type: PROFILE.INIT_CARDS,
        payload: data,
    };
}

export function addCard(data: Card) {
    return {
        type: PROFILE.ADD_CARD,
        payload: data,
    };
}

export function removeCard(data: Card) {
    return {
        type: PROFILE.REMOVE_CARD,
        payload: data,
    };
}

export function setDefaultCard(data: Card) {
    return {
        type: PROFILE.SET_DEFAULT_CARD,
        payload: data,
    };
}
