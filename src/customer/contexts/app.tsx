import React, { useState, useContext, createContext } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";

import { SearchProvider } from "contexts/search";

import { signout as signoutAction } from "actions/auth";

type AppProps = {
    config: any;
    getConfig: any;
    useDispatch: any;
    account: any;
    signout: any;
};

export const CustomerContext = createContext({} as AppProps);

export const CustomerProvider = (props: any) => {
    const account = useSelector((state: any) => state["profile"]["account"]);

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

    return (
        <CustomerContext.Provider
            value={{
                config,
                getConfig,
                useDispatch,
                account,
                signout,
            }}
        >
            <SearchProvider>{props.children}</SearchProvider>
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => {
    return useContext(CustomerContext);
};
