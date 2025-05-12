import _ from "lodash";

import { TOKEN_KEY } from "config/constant";

import {
    Profile,
    Account,
    User,
    Card,
    Contact,
    Provider,
} from "interfaces/profile";

import Log from "./log";
import { encrypt, decrypt } from "./encrypt";
import { getLocalState, setLocalState, removeLocalState } from "./storage";

const KEY = "_SEU_PE";

export async function setToken(token: string) {
    await setLocalState(TOKEN_KEY, token);
}

export async function getToken() {
    return await getLocalState(TOKEN_KEY);
}

export async function removeToken() {
    await removeLocalState(TOKEN_KEY);
}

export async function setAuth(value: Profile) {
    try {
        const data = encrypt(value);
        await setLocalState(KEY, data);
    } catch (error) {
        Log(error);
    }
}

export async function getAuth() {
    try {
        const encrypted = await getLocalState(KEY);
        if (!encrypted) {
            return {};
        }

        return decrypt(encrypted);
    } catch (error) {
        Log(error);
    }
}

export async function updateAuth(value: any) {
    const auth = await getAuth();

    if (_.isEmpty(auth)) {
        await setAuth({
            ...value,
        });
    } else {
        await setAuth({
            ...auth,
            ...value,
        });
    }
}

export async function removeAuth() {
    try {
        await removeToken();
        await removeLocalState(KEY);
    } catch (error) {
        Log(error);
    }
}

export async function fetchAuth(name: string) {
    const auth = await getAuth();

    return !_.isEmpty(auth) && auth[name] !== undefined ? auth[name] : null;
}

export async function getUserAuth() {
    return (await fetchAuth("user")) || {};
}

export async function setUserAuth(value: User) {
    await updateAuth({
        user: value,
    });
}

export async function updateUserAuth(value: User) {
    const user = await getUserAuth();

    await updateAuth({
        user: {
            ...user,
            ...value,
        },
    });
}

export async function getAccountAuth() {
    return (await fetchAuth("account")) || {};
}

export async function setAccountAuth(value: Account) {
    await updateAuth({
        account: value,
    });
}

export async function updateAccountAuth(value: Account) {
    const account = await getAccountAuth();

    await updateAuth({
        account: {
            ...account,
            ...value,
        },
    });
}

export async function removeAccountAuth() {
    await updateAuth({
        account: {},
    });
}

export async function getAddressesAuth() {
    return (await fetchAuth("addresses")) || [];
}

export async function setAddressesAuth(value: Contact[]) {
    await updateAuth({
        addresses: value,
    });
}

export async function addAddressesAuth(value: Contact) {
    const addresses = await getAddressesAuth();

    await updateAuth({
        addresses: [...addresses, value],
    });
}

export async function updateAddressesAuth(value: Contact) {
    let addresses = await getAddressesAuth();

    addresses = addresses.map((item: Contact) =>
        item.id === value.id ? { ...item, ...value } : item
    );

    await updateAuth({
        addresses,
    });
}

export async function removeAddressesAuth(value: Contact) {
    let addresses = await getAddressesAuth();

    addresses = addresses.filter((item: Contact) => item.id !== value.id);

    await updateAuth({
        addresses,
    });
}

export async function setAddressesDefaultAuth(value: Contact) {
    let addresses = await getAddressesAuth();

    addresses = addresses.map((item: Contact) =>
        item.id === value.id
            ? { ...item, default: true }
            : { ...item, default: false }
    );

    await updateAuth({
        addresses,
    });
}

export async function getCardsAuth() {
    return (await fetchAuth("cards")) || [];
}

export async function setCardsAuth(value: Card) {
    await updateAuth({
        cards: value,
    });
}

export async function addCardsAuth(value: Card) {
    const cards = await getCardsAuth();

    await updateAuth({
        cards: [...cards, value],
    });
}

export async function removeCardsAuth(value: Card) {
    let cards = await getCardsAuth();

    cards = cards.filter((card: Card) => card.id !== value.id);

    await updateAuth({
        cards,
    });
}

export async function setCardsDefaultAuth(value: Card) {
    let cards = await getCardsAuth();

    cards = cards.map((item: Card) =>
        item.id === value.id
            ? { ...item, default: true }
            : { ...item, default: false }
    );

    await updateAuth({
        cards,
    });
}

export async function getProviderAuth() {
    return (await fetchAuth("provider")) || {};
}

export async function setProviderAuth(value: Provider | {}) {
    await updateAuth({
        provider: value,
    });
}
