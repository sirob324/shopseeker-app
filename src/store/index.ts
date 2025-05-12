import _ from "lodash";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import applyAppStateListener from "redux-enhancer-react-native-appstate";

import { AsyncStorage } from "helpers/storage";

import AppReducers from "reducers";
import AppSagas from "sagas";

let store: any = null;
let enhancers: any = null;
let sagaMiddleware: any = null;

export const persistConfig = {
    keyPrefix: "u8794fsjkjf",
    key: "aksjjfaaklj",
    storage: AsyncStorage,
    debug: __DEV__,
};

if (__DEV__) {
    const reduxImmutableStateInvariant =
        require("redux-immutable-state-invariant").default();
    const Reactotron = require("reactotron-react-native").default;
    sagaMiddleware = createSagaMiddleware({
        sagaMonitor: Reactotron.createSagaMonitor(),
    });

    enhancers = compose(
        applyAppStateListener(),
        applyMiddleware(reduxImmutableStateInvariant),
        applyMiddleware(sagaMiddleware),
        Reactotron.createEnhancer()
    );
} else {
    sagaMiddleware = createSagaMiddleware();

    enhancers = compose(
        applyAppStateListener(),
        applyMiddleware(sagaMiddleware)
    );
}

const reducers = persistCombineReducers(
    persistConfig,
    _.assign({}, AppReducers)
);

const configureStore = (callback?: () => any) => {
    if (store === null) {
        store = createStore(reducers, enhancers);

        store.persistor = persistStore(store, {}, () => {
            callback && callback();
        });

        sagaMiddleware.run(AppSagas);
    }

    return store;
};

export default configureStore;
