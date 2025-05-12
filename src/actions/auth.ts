import { AUTH } from "./types";

type Callback = {
    success?: Function;
    fail?: Function;
};

export function skipSignin(callback: Callback | null | undefined = null) {
    return {
        type: AUTH.SKIP_SIGNIN,
        callback,
    };
}

export function login(data: string) {
    return {
        type: AUTH.LOGIN_REQUEST,
        payload: data,
    };
}

export function signup(
    data: object,
    callback: Callback | null | undefined = null
) {
    return {
        type: AUTH.SIGNUP_REQUEST,
        payload: data,
        callback,
    };
}

export function signupSuccess(
    data: object,
    callback: Function | null | undefined = null
) {
    return {
        type: AUTH.SIGNUP_SUCCESS,
        payload: data,
        callback,
    };
}

export function signupFailure(
    data: object,
    callback: Function | null | undefined = null
) {
    return {
        type: AUTH.SIGNUP_FAILURE,
        payload: data,
        callback,
    };
}

export function signin(
    data: object,
    callback: Callback | null | undefined = null
) {
    return {
        type: AUTH.SIGNIN_REQUEST,
        payload: data,
        callback,
    };
}

export function signinSuccess(
    data: object,
    callback: Function | null | undefined = null
) {
    return {
        type: AUTH.SIGNIN_SUCCESS,
        payload: data,
        callback,
    };
}

export function signinFailure(
    data: object,
    callback: Function | null | undefined = null
) {
    return {
        type: AUTH.SIGNIN_FAILURE,
        payload: data,
        callback,
    };
}

export function signout(callback: Callback | null | undefined = null) {
    return {
        type: AUTH.SIGNOUT_REQUEST,
        callback,
    };
}

export function signoutSuccess(callback: Function | null | undefined = null) {
    return {
        type: AUTH.SIGNOUT_SUCCESS,
        callback,
    };
}
