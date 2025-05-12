import _ from "lodash";

const KEY = "_YU_TC_";

import { getLocalState, setLocalState, removeLocalState } from "./storage";

export async function setHistory(value: object, key = "") {
    await setLocalState(KEY + "_" + key, value);
}

export async function getHistory(key = "") {
    const history = await getLocalState(KEY + "_" + key);
    return history;
}

export async function removeToken(key = "") {
    await removeLocalState(KEY + "_" + key);
}
