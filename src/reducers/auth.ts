import { AUTH } from "actions/types";

interface ACTION {
    type: string;
    payload: string | object | null;
}

const initialState = {
    hasSkippedSignin: false,
    lastUpdateUsernameTS: null,
};

function Auth(state = initialState, action: ACTION) {
    switch (action.type) {
        case AUTH.SKIP_SIGNIN:
            return {
                ...state,
                hasSkippedSignin: true,
            };

        default:
            return state;
    }
}

export default Auth;
