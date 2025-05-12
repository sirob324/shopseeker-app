module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        "@babel/plugin-proposal-export-namespace-from",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        [
            "module-resolver",
            {
                extensions: [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx",
                    ".android.js",
                    ".android.tsx",
                    ".ios.js",
                    ".ios.tsx",
                ],
                root: ["./src"],
            },
        ],
        "react-native-reanimated/plugin",
    ],
};
