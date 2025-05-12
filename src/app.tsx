import React, { useEffect, useState } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { DefaultTheme } from "@react-navigation/native";

import StatusBar from "components/status-bar";

import Customer from "customer/route";
import { CustomerProvider } from "customer/contexts/app";

import Deliver from "deliver/route";
import { DeliverProvider } from "deliver/contexts/app";

import Merchant from "merchant/route";
import { MerchantProvider } from "merchant/contexts/app";

const App = ({ states, dispatch }: any) => {
    const profile = states.profile;

    const [whoami, setWhoami] = useState({});

    useEffect(() => {
        const { user, account, deliver, merchant } = profile;

        const isLoggedIn = !_.isEmpty(_.get(user, "id"));
        const isAccount = isLoggedIn && _.get(user, "type") === "account";
        const isMerchant = isLoggedIn && _.get(user, "type") === "merchant";
        const isDeliver = isLoggedIn && _.get(user, "type") === "deliver";

        setWhoami({
            isLoggedIn,
            isAccount,
            isMerchant,
            isDeliver,
            user,
            account,
            deliver,
            merchant,
        });
    }, [profile]);

    const fullState = {
        ...whoami,
        states,
        dispatch,
    };

    return _.get(whoami, "isDeliver") === true ? (
        <DeliverProvider {...fullState}>
            <StatusBar light={!DefaultTheme.dark} />
            <Deliver />
        </DeliverProvider>
    ) : _.get(whoami, "isMerchant") === true ? (
        <MerchantProvider {...fullState}>
            <StatusBar light={!DefaultTheme.dark} />
            <Merchant />
        </MerchantProvider>
    ) : (
        <CustomerProvider {...fullState}>
            <StatusBar light={!DefaultTheme.dark} />
            <Customer />
        </CustomerProvider>
    );
};

const mapStateToProps = (states: any) => {
    return {
        states,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
