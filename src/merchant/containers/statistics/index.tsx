import React from "react";
import _ from "lodash";

import Div from "components/div";

import BankStatusWidget from "merchant/widgets/bank/status";
import BankBalanceWidget from "merchant/widgets/bank/balance";
import SalesSummary from "merchant/widgets/sales/summary";

import Style from "style";

const StatisticsPage = (props: any) => {
    return (
        <Div
            style={[
                Style.w_p100,
                Style.h_p100,
                Style.column,
                Style.row_start,
                Style.p_v_2,
            ]}
        >
            <BankStatusWidget {...props} />
            <Div style={[Style.bg_color_light_dark, Style.m_v_2]}></Div>
            <BankBalanceWidget {...props} />
            <Div style={[Style.bg_color_light_dark, Style.m_v_2]}></Div>
            <SalesSummary {...props} />
        </Div>
    );
};

export default StatisticsPage;
