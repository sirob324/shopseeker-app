import _ from "lodash";
import {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
} from "react-native-fbsdk-next";

import Log from "helpers/log";

const Facebook = {
    _tokens: {},

    _profile: {},

    getTokens: () => {
        return Facebook._tokens;
    },

    setTokens: (tokens: object) => {
        Facebook._tokens = {
            ...Facebook._tokens,
            ...tokens,
        };
    },

    getProfile: () => {
        return Facebook._profile;
    },

    setProfile: (profile: object) => {
        if (!_.isNil(profile) && !_.isEmpty(profile)) {
            Facebook._profile = {
                ...Facebook._profile,
                ...profile,
            };
        }
    },

    api: (path: string, callback: Function, ...args: any) => {
        const argByType: any = {};

        _.map(args, (arg: any) => {
            argByType[typeof arg] = arg;
        });

        const httpMethod = (argByType.string || "get").toUpperCase();
        const _params = argByType.object || {};

        const parameters: any = {};
        _.each(_params, (value: any, key: string) => {
            parameters[key] = {
                string: value,
            };
        });

        new GraphRequestManager()
            .addRequest(
                new GraphRequest(path, { parameters, httpMethod }, callback)
            )
            .start();
    },

    login: async () => {
        const res = await LoginManager.logInWithPermissions([
            "public_profile",
            "email",
            "openid",
        ]);

        if (res.isCancelled) {
            throw new Error("cancelled");
        }

        const tokens: any = await AccessToken.getCurrentAccessToken();

        if (_.isNil(tokens)) {
            throw new Error("failed");
        }

        Facebook.setTokens(tokens);

        const profile: any = await Facebook.me();

        Facebook.setProfile(profile);

        return {
            status: "succeeded",
            data: {
                tokens,
                profile,
            },
        };
    },

    logout: () => {
        LoginManager.logOut();
    },

    me: () => {
        return new Promise((resolve, reject) => {
            Facebook.api(
                "/me",
                (error?: object, res?: object) => {
                    if (!error) {
                        if (!_.isNil(res)) {
                            resolve(res);
                        } else {
                            resolve({});
                        }
                    } else {
                        Log(error);
                        resolve({});
                    }
                },
                {
                    fields: "name,first_name,last_name,picture.type(large),email",
                }
            );
        });
    },
};

export default Facebook;
