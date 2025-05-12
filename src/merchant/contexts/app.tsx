import React, { useState, useContext, createContext } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";

import { signout as signoutAction } from "actions/auth";
import { updateMerchant as updateMerchantAction } from "actions/profile";

type AppProps = {
    config: any;
    getConfig: any;
    useDispatch: any;
    merchant: any;
    signout: any;
    updateMerchant: any;
};

export const MerchantContext = createContext({} as AppProps);

export const MerchantProvider = (props: any) => {
    const merchant = useSelector((state: any) => state["profile"]["merchant"]);

    const needs = _.omit(props, ["children", "states", "dispatch"]);

    const [config] = useState({
        ...needs,
        ...props.states,
    });

    const getConfig = (property: string): any => {
        return _.get(config, property, null);
    };

    const useDispatch = (action: any): any => {
        props.dispatch(action);
    };

    const signout = (callback = undefined) => {
        useDispatch(signoutAction({ success: callback }));
    };

    const updateMerchant = (data: any) => {
        useDispatch(updateMerchantAction(data));
    };

    return (
        <MerchantContext.Provider
            value={{
                config,
                getConfig,
                useDispatch,
                merchant,
                signout,
                updateMerchant,
            }}
        >
            {props.children}
        </MerchantContext.Provider>
    );
};

export const useMerchant = () => {
    return useContext(MerchantContext);
};
