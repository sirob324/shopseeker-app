import React from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import SafeView from "components/safe-area-view";
import LanguageRegion from "components/language-region";

import { trans } from "locales";

import Style from "style";

import { TERMS_PAGE, PRIVACY_PAGE } from "config/route";

import { navigate } from "navigation";

import { useDeliver } from "deliver/contexts/app";

const DrawerPage = (props: any) => {
    const { signout } = useDeliver();

    const { navigation } = props;

    return (
        <SafeView>
            <Div
                style={[
                    Style.column,
                    Style.row_between,
                    Style.h_p100,
                    Style.bg_color_15,
                ]}
            >
                <Div>
                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_end,
                            Style.p_h_3,
                        ]}
                        onPress={() => navigation.closeDrawer()}
                    >
                        <Icon name="arrow-forward-outline" />
                    </Div>
                    <LanguageRegion />
                </Div>
                <Div style={[Style.column, Style.row_center, Style.p_h_3]}>
                    <A onPress={() => signout()}>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_dark,
                                Style.f_weight_500,
                            ]}
                        >
                            {trans("navlinkLogout")}
                        </Text>
                    </A>

                    <A onPress={() => navigate(TERMS_PAGE)}>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_dark,
                                Style.f_weight_500,
                                Style.m_t_2,
                            ]}
                        >
                            {trans("terms_of_use")}
                        </Text>
                    </A>

                    <A onPress={() => navigate(PRIVACY_PAGE)}>
                        <Text
                            style={[
                                Style.f_size_13,
                                Style.f_color_dark,
                                Style.f_weight_500,
                                Style.m_t_2,
                            ]}
                        >
                            {trans("privacy_policy")}
                        </Text>
                    </A>

                    <Div style={[Style.row, Style.column_center, Style.m_t_2]}>
                        <Icon
                            name="copyright"
                            size={Style.f_size_12.fontSize}
                            color={Style.f_color_dark.color}
                        />
                        <Text
                            style={[
                                Style.m_l_1,
                                Style.f_size_12,
                                Style.f_color_dark_light,
                                Style.f_weight_500,
                            ]}
                        >
                            MarchéHub Inc.
                        </Text>
                    </Div>
                </Div>
            </Div>
        </SafeView>
    );
};

export default DrawerPage;
