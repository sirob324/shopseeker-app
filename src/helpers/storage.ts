import _ from "lodash";
import MMKVStorage from "react-native-mmkv-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = new MMKVStorage.Loader().initialize();

const getLocalState = async (key: string) => {
    try {
        const serializedState = await AsyncStorage.getItem(key);

        return serializedState ? JSON.parse(serializedState) : null;
    } catch (e) {
        return null;
    }
};

const setLocalState = async (key: string, value: object | null) => {
    try {
        const serializedState = JSON.stringify(value);
        await AsyncStorage.setItem(key, serializedState);
    } catch (e) {}
};

const removeLocalState = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {}
};

export {
    AsyncStorage,
    storage,
    getLocalState,
    setLocalState,
    removeLocalState,
};
