import { NAV } from "actions/types";

const InitState = {
    region: {},
    type: {},
};

function Nav(state = InitState, action: any) {
    switch (action.type) {
        case NAV.UPDATE_REGION:
            return {
                ...state,
                region: action.payload,
            };

        case NAV.UPDATE_TYPE:
            return {
                ...state,
                type: action.payload,
            };

        default:
            return state;
    }
}

export default Nav;
