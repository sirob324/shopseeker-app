import React from "react";

import { trans } from "locales";

import Div from "components/div";
import Text from "components/text";
import Image from "components/image";

import Style from "style";

const NoResultFound = () => {
    return (
        <Div
            style={[
                Style.column,
                Style.column_center,
                Style.w_p100,
                Style.p_h_4,
                Style.p_v_6,
            ]}
        >
            <Div style={[Style.w_p100, Style.h_50, Style.m_b_10]}>
                <Image src={require("assets/image/no-result.png")} />
            </Div>
            <Text>{trans("noProductFound")}</Text>
        </Div>
    );
};

export default NoResultFound;
