import React, { FC } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TERMS_PAGE, PRIVACY_PAGE } from "config/route";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import LanguageRegion from "components/language-region";

import { navigate } from "./navigation";

import { trans } from "locales";

import Style from "style";

const Drawer: FC = () => {
    return (
        <Div
            style={[
                Style.w_p100,
                Style.h_p100,
                Style.column,
                Style.row_between,
                Style.bg_color_15,
                Style.p_v_6,
            ]}
        >
            <LanguageRegion />
            <Div style={[Style.column, Style.row_center, Style.p_l_4]}>
                <A onPress={() => navigate(TERMS_PAGE, {})}>
                    <Text
                        style={[
                            Style.f_color_gray_dark,
                            Style.f_size_14,
                            Style.f_bold,
                        ]}
                    >
                        {trans("terms_of_use")}
                    </Text>
                </A>
                <A onPress={() => navigate(PRIVACY_PAGE, {})}>
                    <Text
                        style={[
                            Style.f_color_gray_dark,
                            Style.f_size_14,
                            Style.f_bold,
                            Style.m_t_3,
                        ]}
                    >
                        {trans("privacy_policy")}
                    </Text>
                </A>
                <Div style={[Style.row, Style.column_center, Style.m_t_4]}>
                    <MaterialCommunityIcons
                        name="copyright"
                        style={[Style.f_color_11]}
                    />
                    <Text
                        style={[
                            Style.m_l_1,
                            Style.f_size_12,
                            Style.f_weight_500,
                            Style.f_color_11,
                        ]}
                    >
                        2020 MarchéHub Inc.
                    </Text>
                </Div>
            </Div>
        </Div>
    );
};

export default Drawer;
