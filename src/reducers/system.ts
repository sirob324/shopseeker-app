import { SYSTEM } from "actions/types";

interface ACTION {
    type: string;
    payload: any;
}

const initialState = {
    installed: false,
    config: {},
    locale: "",
    location: [],
    notification: {},
    status: "init",
};

function System(state = initialState, action: ACTION) {
    switch (action.type) {
        case SYSTEM.INSTALL_DEVICE:
            return {
                ...state,
                installed: true,
            };

        case SYSTEM.LOAD_CONFIG:
            return {
                ...state,
                config: action.payload,
            };

        case SYSTEM.CHANGE_LOCALE:
            return {
                ...state,
                locale: action.payload,
            };

        case SYSTEM.CHANGE_LOCATION:
            return {
                ...state,
                location: action.payload,
            };

        case SYSTEM.REGISTER_NOTIFICATION:
            return {
                ...state,
                notification: {
                    ...state.notification,
                    ...action.payload,
                },
            };

        case SYSTEM.CHANGE_STATUS:
            return {
                ...state,
                status: action.payload,
            };

        default:
            return state;
    }
}

export default System;
