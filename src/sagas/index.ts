import { all } from "redux-saga/effects";

import auth from "./auth";
import cart from "./cart";
import deepLinking from "./deepLinking";
import mode from "./mode";
import notification from "./notification";
import profile from "./profile";
import region from "./region";
import system from "./system";

const root = function* root() {
    yield all([
        auth(),
        cart(),
        deepLinking(),
        mode(),
        notification(),
        profile(),
        region(),
        system(),
    ]);
};

export default root;
