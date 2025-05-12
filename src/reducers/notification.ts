import { NOTIFICATION } from "actions/types";

interface ACTION {
    type: string;
    payload: string;
}

const initialState = {
    inapp_notification: null,
};

function Notification(state = initialState, action: ACTION) {
    switch (action.type) {
        case NOTIFICATION.INAPP_RECEIVED:
            return {
                ...state,
                inapp_notification: action.payload,
            };

        case NOTIFICATION.INAPP_REMOVE:
            return {
                ...state,
                inapp_notification: null,
            };

        default:
            return state;
    }
}

export default Notification;
