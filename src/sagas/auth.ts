import _ from "lodash";
import Parse from "parse/react-native";
import { put, call, takeLatest } from "redux-saga/effects";

import { ACCOUNT, MERCHANT, DELIVER } from "graphql/query";

import Config from "config";
import { trans } from "locales";
import { API_SIGNIN, API_SIGNUP } from "config/route";

import Log from "helpers/log";
import Lib from "helpers/lib";
import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";
import { updateInstallation } from "helpers/parse";
import { setToken, removeToken } from "helpers/profile";

import { AUTH } from "actions/types";
import {
    signupSuccess,
    signupFailure,
    signinSuccess,
    signinFailure,
    signoutSuccess,
} from "actions/auth";
import {
    initUser,
    updateProvider,
    resetProfile,
    initProfile,
    initMerchant,
    initDeliver,
} from "actions/profile";
import { clearCart } from "actions/cart";

import { createAccount } from "request/account";

import Facebook from "lib/facebook";
import Google from "lib/google";
import Apple from "lib/apple";

import Style from "style";

const handlePostRequest = async (host, data, isEncrypt = true) => {
    return await fetch(
        host,
        "post",
        isEncrypt
            ? {
                  ie: true,
                  data: encrypt(data),
              }
            : data
    );
};

const skip_signin = function* () {};

const _signup = function* (profile: any) {
    const res: any = yield call(handlePostRequest, API_SIGNUP, profile);

    if (_.has(res, "user")) {
        if (_.get(profile, "type") === "account" && _.get(res, "user.id")) {
            const { status } = yield call(createAccount, {
                uid: _.get(res, "user.id"),
                ...profile,
            });

            if (status === "failed") {
                return {
                    status: "failed",
                    data: trans("failed"),
                };
            }
        }

        return {
            status: "succeeded",
            data: {
                token: _.get(res, "jwt", ""),
                user: res.user,
            },
        };
    } else if (_.has(res, "error") && _.has(res, "message")) {
        let message = "";

        if (_.isString(res.message)) {
            message = res.message;
        } else if (!_.isEmpty(res.message)) {
            message = _.has(res.message, "id")
                ? trans(res.message.id)
                : res.message.message;
        }

        return {
            status: "failed",
            data: message,
        };
    } else {
        return {
            status: "failed",
            data: trans("error.unknown"),
        };
    }
};

const signup = function* ({ payload, callback }) {
    let profile = payload;

    let signupRes = {
        status: "failed",
        data: null,
    };

    Lib.showToast(trans("signup") + "...", {
        style: {
            ...Style.bg_color_dark,
        },
        textStyle: {
            ...Style.f_color_15,
        },
    });

    try {
        signupRes = yield call(_signup, profile);

        const { status, data } = signupRes;

        if (status === "succeeded") {
            const { token, user } = data;

            const userData = {
                id: user.id,
                confirmed: user.confirmed,
                blocked: user.blocked,
                provider: user.provider || "local",
                username: user.username,
                email: user.email,
                type: user.type || "account",
            };

            return yield put(
                signupSuccess(
                    {
                        message: trans("signup_success_content", {
                            email: userData.email,
                        }),
                        token,
                        user: {
                            ...userData,
                            password: profile.password,
                        },
                    },
                    callback.success
                )
            );
        } else {
            return yield put(
                signupFailure(
                    {
                        message: data,
                    },
                    callback.fail
                )
            );
        }
    } catch (e) {
        Log(e);

        return yield put(
            signupFailure(
                {
                    message: e.message,
                },
                callback.fail
            )
        );
    }
};

const signup_success = function* ({ payload, callback }) {
    yield call(_signinParseServer, payload);

    Lib.showToast(_.get(payload, "message", trans("succeeded")), {
        onClose: callback,
        style: {
            ...Style.bg_color_success,
        },
        textStyle: {
            ...Style.f_color_15,
        },
    });
};

const signup_fail = function* ({ payload, callback }) {
    Lib.showToast(_.get(payload, "message", trans("failed")), {
        onClose: callback,
        style: {
            ...Style.bg_color_danger,
        },
        textStyle: {
            ...Style.f_color_15,
        },
    });
};

const _signinFacebook = function* () {
    let tokens = {};
    let profile = {};

    const { status, data } = yield Facebook.login();

    if (status === "succeeded") {
        if (_.has(data, "profile")) {
            profile = {
                ..._.get(data, "profile"),
            };

            // if (_.has(profile, "picture")) {
            //     _.set(profile, "avatar", _.get(profile, "picture.data.url"));
            // }

            if (_.has(profile, "first_name")) {
                _.set(profile, "nickname", _.get(profile, "first_name"));
            }
        }

        if (_.has(data, "tokens")) {
            tokens = {
                access_token: data.tokens.accessToken,
            };
        }
    }

    return {
        tokens,
        profile,
    };
};

const _signinGoogle = function* () {
    let tokens = {};
    let profile = {};

    const { status, data } = yield Google.login();

    if (status === "succeeded") {
        if (_.has(data, "profile")) {
            profile = {
                ..._.pick(data.profile, ["email", "id"]),
            };

            // if (_.has(data, "profile.photo")) {
            //     _.set(profile, "avatar", _.get(data, "profile.photo"));
            // }

            if (_.has(data, "profile.familyName")) {
                _.set(profile, "last_name", _.get(data, "profile.familyName"));
            }

            if (_.has(data, "profile.givenName")) {
                _.set(profile, "first_name", _.get(data, "profile.givenName"));
                _.set(profile, "nickname", _.get(data, "profile.givenName"));
            }
        }

        if (_.has(data, "tokens")) {
            tokens = {
                id_token: data.idToken,
                access_token: data.accessToken,
            };
        }
    }

    return {
        tokens,
        profile,
    };
};

const _signinApple = function* () {
    let tokens = {};
    let profile = {};

    const { status, data } = yield Apple.login();
    if (status === "succeeded") {
        if (_.has(data, "profile")) {
            profile = data.profile;
        }

        if (_.has(data, "tokens")) {
            tokens = data.tokens;
        }
    }

    return {
        tokens,
        profile,
    };
};

const _signin = function* (profile: any) {
    const res = yield call(handlePostRequest, API_SIGNIN, profile);

    if (_.has(res, "jwt")) {
        return {
            status: "succeeded",
            data: {
                token: res.jwt,
                user: res.user,
            },
        };
    } else if (_.has(res, "error") && _.has(res, "message")) {
        let message = "";

        if (_.isString(res.message)) {
            message = res.message;
        } else if (!_.isEmpty(res.message)) {
            message = _.has(res.message, "id")
                ? trans(res.message.id)
                : res.message.message;
        }

        return {
            status: "failed",
            data: message,
        };
    } else {
        return {
            status: "failed",
            data: trans("error.unknown"),
        };
    }
};

const signin = function* ({ payload, callback }) {
    let profile = payload;

    let signinRes = {
        status: "failed",
        data: null,
    };

    Lib.showToast(trans("signin") + "...", {
        style: {
            ...Style.bg_color_dark,
        },
        textStyle: {
            ...Style.f_color_15,
        },
    });

    try {
        const provider = _.toLower(_.get(profile, "provider", "local"));

        let providerRes: any = {};

        if (provider === "facebook") {
            providerRes = yield call(_signinFacebook);

            const identifier =
                _.get(providerRes, "profile.id") + "@shopseeker.com";

            const password = Lib.c2c(_.get(providerRes, "profile.id"));

            profile = {
                provider,
                identifier,
                password,
            };
        } else if (provider === "google") {
            providerRes = yield call(_signinGoogle);

            const identifier =
                _.get(providerRes, "profile.id") + "@shopseeker.com";

            const password = Lib.c2c(_.get(providerRes, "profile.id"));

            profile = {
                provider,
                identifier,
                password,
            };
        } else if (provider === "apple") {
            providerRes = yield call(_signinApple);

            const identifier =
                _.get(providerRes, "profile.id") + "@shopseeker.com";

            const password = Lib.c2c(_.get(providerRes, "profile.id"));

            profile = {
                provider,
                identifier,
                password,
            };
        }

        signinRes = yield call(_signin, profile);

        const email = profile.identifier;
        const username = Lib.c2c(email);
        const password = profile.password;

        if (provider !== "local" && _.get(signinRes, "status") === "failed") {
            signinRes = yield call(
                _signup,
                _.assign(
                    _.omit(profile, "identifier"),
                    {
                        email,
                        username,
                        password,
                        type: "account",
                        nickname: _.get(providerRes, "profile.nickname", ""),
                    },
                    _.pick(providerRes.profile, [
                        "first_name",
                        "last_name",
                        "gender",
                        "dob",
                        "hometown",
                        "avatar",
                    ])
                )
            );
        }

        const { status, data } = signinRes;

        if (status === "succeeded") {
            const { token, user } = data;

            const userData: any = {
                id: user.id,
                confirmed: user.confirmed,
                blocked: user.blocked,
                provider: user.provider,
                username: user.username,
                email: user.email,
                type: user.type || "account",
            };

            yield call(setToken, token);

            const u_type = _.toLower(userData.type);

            const QUERY =
                u_type === "merchant"
                    ? MERCHANT
                    : u_type === "deliver"
                    ? DELIVER
                    : ACCOUNT;

            const { data: _data, errors } = yield call(
                handlePostRequest,
                Config.REST_HOST,
                {
                    query: QUERY,
                    variables: { id: userData.id },
                }
            );

            if (!_.isNil(errors)) {
                yield call(removeToken);

                return yield put(signinFailure({}, callback.fail));
            } else {
                yield put(initUser(userData));

                const field =
                    u_type === "merchant"
                        ? "merchants"
                        : u_type === "deliver"
                        ? "delivers"
                        : "accounts";

                if (!_.isEmpty(_data) && !_.isEmpty(_data[field])) {
                    const init =
                        u_type === "merchant"
                            ? initMerchant
                            : u_type === "deliver"
                            ? initDeliver
                            : initProfile;

                    yield put(init(_data[field][0]));
                }

                if (
                    provider !== "local" &&
                    !_.isEmpty(_.get(providerRes, "profile")) &&
                    !_.isEmpty(_.get(providerRes, "tokens"))
                ) {
                    yield put(updateProvider(providerRes));
                }

                return yield put(
                    signinSuccess(
                        {
                            token,
                            user: {
                                ...userData,
                                password,
                            },
                        },
                        callback.success
                    )
                );
            }
        } else {
            return yield put(
                signinFailure(
                    {
                        message: data,
                    },
                    callback.fail
                )
            );
        }
    } catch (e) {
        Log(e);

        const { message } = e;

        if (message === "cancelled") {
            return yield put(
                signinFailure(
                    {
                        message: trans("cancelled"),
                    },
                    callback.fail
                )
            );
        } else if (message === "denied") {
            return yield put(
                signinFailure(
                    {
                        message: trans("denied"),
                    },
                    callback.fail
                )
            );
        } else if (message === "failed") {
            return yield put(
                signinFailure(
                    {
                        message: trans("failed"),
                    },
                    callback.fail
                )
            );
        } else {
            return yield put(
                signinFailure(
                    {
                        message: e.message,
                    },
                    callback.fail
                )
            );
        }
    }
};

const _signinParseServer = function* (payload: any) {
    const user = yield Parse.User.currentAsync();

    const {
        token,
        user: { id, email, provider, type, nickname, confirmed, blocked },
    } = payload;

    const installationId: string = yield Parse._getInstallationId();

    if (_.isNil(user)) {
        const userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo("username", id);
        const userRes: any = yield userQuery.first();

        if (!_.isNil(userRes)) {
            Parse.User.logIn(id, id).then((_user) => {
                _user.set("email", email);
                _user.set("installationId", installationId);
                _user.set("jwt", token);
                _user.set("uuid", id);
                _user.set("provider", provider);
                _user.set("type", type);
                _user.set("nickname", nickname);
                _user.set("confirmed", confirmed);
                _user.set("blocked", blocked);
                _user.save(null);

                updateInstallation({
                    user: _user,
                });
            });
        } else {
            const newUser = new Parse.User();
            newUser.set("username", id);
            newUser.set("email", email);
            newUser.set("password", id);
            newUser.set("installationId", installationId);
            newUser.set("jwt", token);
            newUser.set("uuid", id);
            newUser.set("provider", provider);
            newUser.set("type", type);
            newUser.set("nickname", nickname);
            newUser.set("confirmed", confirmed);
            newUser.set("blocked", blocked);
            newUser.signUp().then((_user) => {
                updateInstallation({
                    user: _user,
                });
            });
        }
    } else {
        user.set("email", email);
        user.set("installationId", installationId);
        user.set("jwt", token);
        user.set("uuid", id);
        user.set("provider", provider);
        user.set("type", type);
        user.set("nickname", nickname);
        user.set("confirmed", confirmed);
        user.set("blocked", blocked);

        user.save(null);

        updateInstallation({
            user,
        });
    }
};

const signin_success = function* ({ payload, callback }: any) {
    yield call(_signinParseServer, payload);

    Lib.showToast(trans("succeeded"), {
        onClose: callback,
        style: {
            ...Style.bg_color_success,
        },
        textStyle: {
            ...Style.f_color_15,
        },
    });
};

const signin_fail = function* ({ payload, callback }: any) {
    Lib.showToast(_.get(payload, "message", trans("failed")), {
        onClose: callback,
        style: {
            ...Style.bg_color_danger,
        },
        textStyle: {
            ...Style.f_color_15,
        },
    });
};

const signout = function* ({ callback }: any) {
    yield put(resetProfile());

    yield put(clearCart());

    yield put(signoutSuccess(callback.success));
};

const signout_success = function* ({ callback }: any) {
    Parse.User.logOut().then(() => {
        updateInstallation({
            user: null,
        });
    });

    Lib.showToast(trans("succeeded"), {
        onClose: callback,
        style: {
            ...Style.bg_color_success,
        },
        textStyle: {
            ...Style.f_color_15,
        },
    });
};

const login = function* () {};

const root = function* () {
    yield takeLatest(AUTH.SKIP_SIGNIN, skip_signin);
    yield takeLatest(AUTH.SIGNUP_REQUEST, signup);
    yield takeLatest(AUTH.SIGNUP_SUCCESS, signup_success);
    yield takeLatest(AUTH.SIGNUP_FAILURE, signup_fail);
    yield takeLatest(AUTH.SIGNIN_REQUEST, signin);
    yield takeLatest(AUTH.SIGNIN_SUCCESS, signin_success);
    yield takeLatest(AUTH.SIGNIN_FAILURE, signin_fail);
    yield takeLatest(AUTH.SIGNOUT_REQUEST, signout);
    yield takeLatest(AUTH.SIGNOUT_SUCCESS, signout_success);
    yield takeLatest(AUTH.LOGIN_REQUEST, login);
};

export default root;
