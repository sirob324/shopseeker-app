import React, { FC, useState } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { signin as signinAction } from "actions/auth";

import Lib from "helpers/lib";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Input from "components/input";
import Button from "components/button";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const Signin: FC<Props> = (props) => {
    const [showAsterisks, setShowAsterisks] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailValid = Lib.isValidEmail(email);
    const passwordValid = password !== "";

    const { title, titleStyle = [], signin, callback } = props;

    const submit = () => {
        signin(
            {
                provider: "local",
                password,
                identifier: email,
            },
            callback
        );
    };

    return (
        <Div style={[Style.column, Style.p_4, Style.bg_color_15]}>
            <Text
                style={[
                    Style.f_size_15,
                    Style.f_color_3,
                    Style.f_weight_500,
                    Style.m_b_4,
                    Style.text_center,
                    ...titleStyle,
                ]}
            >
                {title || trans("signinTitle")}
            </Text>

            <Input
                type="email-address"
                confirmType="next"
                value={email}
                placeholder={trans("emailPlaceholder")}
                onChange={(email: string) => setEmail(email)}
            />

            <Div
                style={[
                    Style.position_relative,
                    Style.row,
                    Style.m_v_3,
                    Style.bg_color_gray,
                    Style.border_round_1,
                ]}
            >
                <Input
                    value={password}
                    secureTextEntry={showAsterisks}
                    editable={emailValid}
                    placeholder={trans("passwordPlaceholder")}
                    onChange={(password: string) => setPassword(password)}
                    innerStyle={[Style.p_r_7]}
                />
                <Div
                    style={[
                        Style.right_vertical,
                        Style.v_center,
                        {
                            width: 50,
                        },
                    ]}
                >
                    <A onPress={() => setShowAsterisks(!showAsterisks)}>
                        {showAsterisks === true ? (
                            <Icon
                                name="eye-outline"
                                size={Style.f_size_20.fontSize}
                                color={Style.f_color_5.color}
                            />
                        ) : (
                            <Icon
                                name="eyeoff-outline"
                                size={Style.f_size_20.fontSize}
                                color={Style.f_color_5.color}
                            />
                        )}
                    </A>
                </Div>
            </Div>

            <Button
                size="fullwidth"
                title={trans("signin")}
                onPress={submit}
                disabled={!emailValid || !passwordValid}
                style={[Style.m_t_2]}
            />
        </Div>
    );
};

const mapStateToProps = (state: any) => ({
    locale: state.system.locale,
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        signin: (data: object, callback: any) =>
            dispatch(signinAction(data, callback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
