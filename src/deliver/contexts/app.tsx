import React, { useState, useContext, createContext } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";

import { signout as signoutAction } from "actions/auth";

type AppProps = {
    config: any;
    getConfig: any;
    useDispatch: any;
    deliver: any;
    signout: any;
};

export const DeliverContext = createContext({} as AppProps);

export const DeliverProvider = (props: any) => {
    const deliver = useSelector((state: any) => state["profile"]["deliver"]);

    const needs = _.omit(props, ["children", "states", "dispatch"]);

    const [config] = useState({
        ...needs,
        ...props.states,
    });

    const getConfig = (property: string): any => {
        return _.get(config, property, null);
    };

    const useDispatch = (action: any): any => {
        return props.dispatch(action);
    };

    const signout = (callback = undefined) => {
        useDispatch(signoutAction({ success: callback }));
    };

    return (
        <DeliverContext.Provider
            value={{
                config,
                getConfig,
                useDispatch,
                deliver,
                signout,
            }}
        >
            {props.children}
        </DeliverContext.Provider>
    );
};

export const useDeliver = () => {
    return useContext(DeliverContext);
};
