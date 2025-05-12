import { MODE } from "actions/types";

export function updateState(appState: string) {
    return {
        type: MODE.UPDATE_STATE,
        payload: appState,
    };
}
