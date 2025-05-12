import React, { FC } from "react";
import _ from "lodash";
import { Alert } from "react-native";

import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Button from "components/button";

import { trans } from "locales";

import Style from "style";

type Props = {
    data: {
        id: string;
        account: string;
        account_holder_name?: string;
        account_holder_type?: string;
        bank_name: string;
        country: string;
        currency: string;
        default_for_currency: boolean;
        last4: string;
        object: string;
        routing_number: string;
        status:
            | "new"
            | "validated"
            | "verified"
            | "verification_failed"
            | "errored";
    };
    updateHandler?: (data: object) => void;
    removeHandler?: (data: object) => void;
};

const Bank: FC<Props> = (props) => {
    const {
        data: {
            id,
            account_holder_name,
            account_holder_type,
            bank_name,
            currency,
            default_for_currency,
            last4,
            routing_number,
            status,
        },
        updateHandler,
        removeHandler,
    } = props;

    const hasError = _.includes(
        ["verification_failed", "errored"],
        _.toLower(status)
    );

    return (
        <Div
            style={[
                Style.row,
                Style.column_center,
                Style.row_between,
                Style.bg_color_light,
                Style.p_3,
                Style.m_b_3,
            ]}
        >
            <Div style={[Style.column, Style.row_center]}>
                <Div style={[Style.row, Style.column_center]}>
                    {hasError && (
                        <Icon
                            name="alert-circle"
                            size={Style.f_size_20.fontSize}
                            color={Style.f_color_danger.color}
                        />
                    )}
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_weight_500,
                            Style.m_r_2,
                        ]}
                    >
                        {bank_name}
                    </Text>
                    <Div
                        style={[
                            Style.h_center,
                            Style.bg_color_light_dark,
                            Style.border_round_1,
                            Style.p_l_2,
                            !default_for_currency && Style.p_r_2,
                        ]}
                    >
                        <Text style={[Style.f_size_10]}>
                            {_.toUpper(currency)}
                        </Text>
                        {default_for_currency === true && (
                            <Div
                                style={[
                                    Style.h_center,
                                    Style.bg_color_blue_light,
                                    Style.border_round_right_1,
                                    Style.m_l_1,
                                    Style.p_h_1,
                                    {
                                        paddingTop: 3,
                                        paddingBottom: 3,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        Style.f_size_10,
                                        Style.f_color_blue,
                                    ]}
                                >
                                    {trans("default")}
                                </Text>
                            </Div>
                        )}
                    </Div>
                </Div>
                <Div style={[Style.row, Style.column_center, Style.m_v_2]}>
                    {account_holder_name && (
                        <Text
                            style={[
                                Style.f_size_11,
                                Style.f_color_dark_bold,
                                Style.f_weight_500,
                                Style.m_r_1,
                            ]}
                        >
                            {account_holder_name}
                        </Text>
                    )}
                    {_.includes(
                        ["individual", "company"],
                        account_holder_type
                    ) && (
                        <Div
                            style={[
                                Style.h_center,
                                Style.bg_color_light_dark,
                                Style.border_round_1,
                                Style.p_h_2,
                                {
                                    paddingTop: 3,
                                    paddingBottom: 3,
                                },
                            ]}
                        >
                            <Text style={[Style.f_size_11, Style.f_color_3]}>
                                {trans(
                                    `business_type_${_.toLower(
                                        account_holder_type
                                    )}`
                                )}{" "}
                            </Text>
                        </Div>
                    )}
                </Div>
                <Div style={[Style.row, Style.column_center]}>
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark,
                            Style.f_weight_500,
                        ]}
                    >
                        {routing_number}
                    </Text>
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark,
                            Style.f_weight_500,
                            Style.p_l_3,
                            Style.p_r_1,
                        ]}
                    >
                        {_.repeat("X", 4)}
                    </Text>
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark,
                            Style.f_weight_500,
                        ]}
                    >
                        {last4}
                    </Text>
                </Div>
            </Div>
            {!default_for_currency && (
                <Div
                    style={[
                        Style.column,
                        Style.column_center,
                        Style.row_center,
                    ]}
                >
                    <Button
                        onPress={
                            updateHandler
                                ? () =>
                                      updateHandler({
                                          bankId: id,
                                          default_for_currency: true,
                                      })
                                : undefined
                        }
                        trans="makeDefault"
                        titleStyle={[
                            Style.f_size_12,
                            Style.f_color_dark_medium,
                            Style.f_weight_500,
                        ]}
                        style={[
                            Style.border_round_1,
                            Style.bg_color_light_dark,
                            Style.m_b_3,
                        ]}
                    />
                    <Button
                        onPress={() => {
                            Alert.alert(
                                trans("areYouSure"),
                                undefined,
                                [
                                    {
                                        text: trans("no"),
                                        style: "cancel",
                                    },
                                    {
                                        text: trans("yes"),
                                        onPress: removeHandler
                                            ? () =>
                                                  removeHandler({
                                                      bankId: id,
                                                  })
                                            : undefined,
                                    },
                                ],
                                {
                                    cancelable: true,
                                }
                            );
                        }}
                        trans="remove"
                        titleStyle={[
                            Style.f_size_12,
                            Style.f_color_dark_medium,
                            Style.f_weight_500,
                        ]}
                        style={[
                            Style.border_round_1,
                            Style.bg_color_light_dark,
                        ]}
                    />
                </Div>
            )}
        </Div>
    );
};

export default Bank;
