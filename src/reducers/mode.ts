import { MODE } from "actions/types";

interface ACTION {
    type: string;
    payload: string;
}

const initialState = {
    appState: "",
};

function Mode(state = initialState, action: ACTION) {
    switch (action.type) {
        case MODE.UPDATE_STATE:
            return {
                appState: action.payload,
            };

        default:
            return state;
    }
}

export default Mode;
