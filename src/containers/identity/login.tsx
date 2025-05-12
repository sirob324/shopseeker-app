import React, { FC } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Apple from "lib/apple";

import { TERMS_PAGE, PRIVACY_PAGE } from "config/route";

import { signin as signinAction } from "actions/auth";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Image from "components/image";

import { navigate } from "navigation";

import { trans } from "locales";

import Style from "style";

import AppleLogo from "assets/icon/apple.png";
import GoogleLogo from "assets/icon/google.png";
import FacebookLogo from "assets/icon/facebook.png";

type Props = {
    [key: string]: any;
};

const Login: FC<Props> = (props) => {
    const { signin, callback } = props;

    const supportAppleLogin: boolean = Apple.isSupported();

    return (
        <Div style={[Style.column, Style.p_h_4, Style.bg_color_15]}>
            <Div style={[Style.v_center, Style.b_b_light_medium]}>
                <Text
                    style={[
                        Style.bg_color_15,
                        Style.f_size_13,
                        Style.f_color_6,
                        Style.f_weight_500,
                        Style.p_h_2,
                        Style.position_relative,
                        {
                            bottom: -10,
                        },
                    ]}
                >
                    {trans("or")}
                </Text>
            </Div>

            <Div style={[Style.h_center, Style.m_t_6]}>
                {supportAppleLogin && (
                    <Div
                        onClick={() => signin({ provider: "apple" }, callback)}
                        style={[Style.m_h_2]}
                    >
                        <Image
                            src={AppleLogo}
                            style={{
                                width: 35,
                                height: 35,
                            }}
                        />
                    </Div>
                )}
                <Div
                    onClick={() => signin({ provider: "facebook" }, callback)}
                    style={[Style.m_h_2]}
                >
                    <Image
                        src={FacebookLogo}
                        style={{
                            width: 35,
                            height: 35,
                        }}
                    />
                </Div>
                <Div
                    onClick={() => signin({ provider: "google" }, callback)}
                    style={[Style.m_h_2]}
                >
                    <Image
                        src={GoogleLogo}
                        style={{
                            width: 35,
                            height: 35,
                        }}
                    />
                </Div>
            </Div>

            <Div
                style={[
                    Style.row,
                    Style.row_start,
                    Style.column_center,
                    Style.wrap,
                    Style.m_t_6,
                ]}
            >
                <Text style={[Style.f_size_15, Style.f_color_6, Style.l_h_5]}>
                    {trans("eula_1", {
                        title: `${supportAppleLogin ? "Apple, " : ""}${trans(
                            "facebook"
                        )}, ${trans("google")}`,
                    })}
                    <A onPress={() => navigate(TERMS_PAGE)}>
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_color_first,
                                Style.l_h_5,
                                Style.underline,
                            ]}
                        >
                            {trans("terms_of_use")}
                        </Text>
                    </A>
                    {trans("eula_2")}
                    <A onPress={() => navigate(PRIVACY_PAGE)}>
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_color_first,
                                Style.l_h_5,
                                Style.underline,
                            ]}
                        >
                            {trans("privacy_policy")}
                        </Text>
                    </A>
                </Text>
            </Div>
        </Div>
    );
};

const mapStateToProps = (state: any) => ({
    locale: state.system.locale
});

const mapDispatchToProps = (dispatch: any) => ({
    signin: (data: any, callback: any) =>
        dispatch(signinAction(data, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
