import _ from "lodash";
import {
    GoogleSignin,
    statusCodes,
} from "@react-native-google-signin/google-signin";

import Config from "config";

import Log from "helpers/log";

const Google = {
    _tokens: {},

    _profile: {},

    getTokens: () => {
        return Google._tokens;
    },

    setTokens: (tokens: object) => {
        Google._tokens = {
            ...Google._tokens,
            ...tokens,
        };
    },

    getProfile: () => {
        return Google._profile;
    },

    setProfile: (profile: any) => {
        if (!_.isNil(profile) && !_.isEmpty(profile)) {
            Google._profile = {
                ...Google._profile,
                ...profile,
            };
        }
    },

    hasPlayServices: async () => {
        return await GoogleSignin.hasPlayServices();
    },

    login: async () => {
        let err = {
            status: 0,
            message: "",
        };

        GoogleSignin.configure({
            scopes: [
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile",
            ],
            webClientId: Config.GOOGLE_CLIENT_ID,
        });

        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });

            const res = await GoogleSignin.signIn();

            if (_.has(res, "idToken")) {
                Google.setTokens({
                    idToken: res.idToken,
                });
            }

            if (_.has(res, "user")) {
                Google.setProfile(res.user);
            }

            const tokens = await GoogleSignin.getTokens();

            if (!_.isNil(tokens) && _.isEmpty(tokens)) {
                Google.setTokens(tokens);
            }

            return {
                status: "succeeded",
                data: {
                    tokens,
                    profile: res.user,
                },
            };
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                err = {
                    status: 1,
                    message: "cancelled",
                };
            } else if (error.code === statusCodes.IN_PROGRESS) {
                err = {
                    status: 1,
                    message: "Progress already",
                };
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                err = {
                    status: 1,
                    message: "Play services not available or outdated",
                };
            } else {
                err = {
                    status: 1,
                    message: "some other error happened",
                };
            }
        }

        if (err.status === 1) {
            throw new Error(err.message);
        }
    },

    isLoggedIn: async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();

        return !isSignedIn;
    },

    logout: async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();

            Google.setProfile({});
        } catch (error) {
            Log(error);
        }
    },

    me: async () => {
        const user: any = await GoogleSignin.getCurrentUser();

        if (!_.isNil(user) && _.get(user, "user")) {
            Google.setProfile(user.user);
            return user.user;
        }
    },
};

export default Google;
