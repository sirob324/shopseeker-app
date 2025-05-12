import React, { FC, useState } from "react";
import _ from "lodash";

import { forgotPassword } from "request/user";

import Lib from "helpers/lib";

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

const ForgotPassword: FC<Props> = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("failed");
    const [message, setMessage] = useState("");

    const emailValid = Lib.isValidEmail(email);

    const submit = async () => {
        Lib.showToast("...");

        const res = await forgotPassword(email);

        if (_.has(res, "ok") && _.get(res, "ok") === true) {
            Lib.showToast(trans("succeeded"), {
                onClose: () => {
                    setStatus("succeeded");
                    setMessage(
                        trans("sendResetPasswordSuccess", { email: email })
                    );
                },
            });
        } else {
            Lib.showToast(trans("failed"), {
                onClose: () =>
                    setMessage(
                        _.has(res, "error")
                            ? trans(res.message[0].messages[0].id)
                            : trans("failed")
                    ),
            });
        }
    };

    const resend = async () => {
        Lib.showToast("...");

        const res = await forgotPassword(email);

        if (_.has(res, "ok") && _.get(res, "ok") === true) {
            Lib.showToast(trans("succeeded"));
        } else {
            Lib.showToast(trans("failed"));
        }
    };

    return message !== "" ? (
        <Div style={[Style.v_center, Style.p_4]}>
            {status === "succeeded" ? (
                <Icon
                    name="checkmark-circle"
                    size={80}
                    color={Style.f_color_success.color}
                />
            ) : (
                <Icon
                    name="close-circle"
                    size={80}
                    color={Style.f_color_danger.color}
                />
            )}
            <Text style={[Style.f_size_15, Style.text_center, Style.m_t_5]}>
                {message}
            </Text>
            <Div style={[Style.h_center, Style.m_t_5]}>
                <Text
                    style={[Style.f_size_13, Style.f_color_dark, Style.m_r_2]}
                >
                    {trans("didnotGetEmail")}
                </Text>
                <Button size="small" trans="resend" onPress={resend} />
            </Div>
        </Div>
    ) : (
        <Div style={[Style.column, Style.p_4]}>
            <Text
                style={[
                    Style.f_size_15,
                    Style.f_weight_500,
                    Style.m_b_4,
                    Style.text_center,
                ]}
            >
                {trans("forgotPasswordTitle")}
            </Text>

            <Text style={[Style.f_size_13, Style.f_color_dark, Style.m_b_6]}>
                {trans("sendResetPassword")}
            </Text>

            <Input
                type="email-address"
                confirmType="done"
                value={email}
                placeholder={trans("emailPlaceholder")}
                onChange={(email: string) => setEmail(email)}
                style={[Style.m_b_6]}
            />

            <Button
                size="fullwidth"
                trans="resetPassword"
                onPress={submit}
                disabled={!emailValid}
            />
        </Div>
    );
};

export default ForgotPassword;
