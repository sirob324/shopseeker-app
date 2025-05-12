import "react-native-gesture-handler";
import { AppRegistry } from "react-native";

if (__DEV__) {
    require("./src/reactotron");
} else {
    console.log = () => {};
    console.time = () => {};
    console.timeLog = () => {};
    console.timeEnd = () => {};
    console.warn = () => {};
    console.count = () => {};
    console.countReset = () => {};
    console.error = () => {};
    console.info = () => {};
}

AppRegistry.registerComponent(
    "shopseeker",
    () => require("./src/index").default
);
