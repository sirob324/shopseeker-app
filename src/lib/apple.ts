import _ from "lodash";
import { appleAuth } from "@invertase/react-native-apple-authentication";

import Log from "helpers/log";

const Apple = {
    _tokens: {},

    _profile: {},

    getTokens: () => {
        return Apple._tokens;
    },

    setTokens: (tokens: object) => {
        Apple._tokens = {
            ...Apple._tokens,
            ...tokens,
        };
    },

    getProfile: () => {
        return Apple._profile;
    },

    setProfile: (profile: object) => {
        if (!_.isNil(profile) && !_.isEmpty(profile)) {
            Apple._profile = {
                ...Apple._profile,
                ...profile,
            };
        }
    },

    isSupported: () => {
        return appleAuth.isSupported;
    },

    login: async () => {
        try {
            const res = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [
                    appleAuth.Scope.EMAIL,
                    appleAuth.Scope.FULL_NAME,
                ],
            });

            let tokens: any = {};
            let profile: any = {};

            if (!_.isEmpty(res)) {
                if (_.has(res, "authorizationCode")) {
                    _.set(tokens, "authorizationCode", res.authorizationCode);
                }

                if (_.has(res, "identityToken")) {
                    _.set(tokens, "identityToken", res.identityToken);
                }

                if (_.has(res, "user")) {
                    _.set(profile, "id", _.join(_.split(res.user, "."), "_"));
                }

                if (_.has(res, "email") && _.get(res, "email")) {
                    _.set(profile, "email", res.email);
                }

                if (_.has(res, "fullName")) {
                    if (_.get(res, "fullName.familyName")) {
                        _.set(
                            profile,
                            "last_name",
                            _.get(res, "fullName.familyName")
                        );
                    }

                    if (_.get(res, "fullName.givenName")) {
                        _.set(
                            profile,
                            "first_name",
                            _.get(res, "fullName.givenName")
                        );
                        _.set(
                            profile,
                            "nickname",
                            _.get(res, "fullName.givenName")
                        );
                    }

                    if (_.get(res, "fullName.nickname")) {
                        _.set(
                            profile,
                            "nickname",
                            _.get(res, "fullName.nickname")
                        );
                    }
                }
            }

            return {
                status: "succeeded",
                data: {
                    tokens,
                    profile,
                },
            };
        } catch (e) {
            Log(e);

            throw new Error("cancelled");
        }
    },

    logout: () => {},

    me: () => {},
};

export default Apple;
