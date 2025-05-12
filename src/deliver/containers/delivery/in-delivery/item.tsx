import React, { FC, useState } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import Currency from "currency.js";

import CurrencyModel from "model/currency";

import { updateDeliveryStatus } from "deliver/request";

import Lib from "helpers/lib";

import Div from "components/div";
import Text from "components/text";
import Button from "components/button";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const InDeliveryItem: FC<Props> = (props) => {
    const { deliver, delivery, onClick, callback } = props;

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const currency = _.toLower(_.get(delivery, "currency"));
    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);
    const inDeliveryTime = dayjs(_.get(delivery, "inDeliveryTime")).format(
        "YYYY-MM-DD HH:mm"
    );

    const op = async (data: object) => {
        setLoading(true);
        setDisabled(true);

        const res = await updateDeliveryStatus(data);

        let message = "";
        let status = "";

        if (_.get(res, "status") === "succeeded") {
            message = trans("succeeded");
            status = "succeeded";
        } else if (_.get(res, "status") === "failed") {
            message = trans(_.get(res, "data") ? res.data : "failed");
            status = "failed";
        } else if (_.get(res, "status") === "error") {
            message = res.message;
            status = "error";
        }

        let duration = 1000;

        let style = {
            ...Style.row,
            ...Style.column_center,
            ...Style.border_round_3,
            ...Style.p_v_2,
            ...Style.p_h_3,
        };

        let textStyle = {};

        if (status === "succeeded") {
            style = {
                ...style,
                ...Style.bg_color_success,
            };

            textStyle = {
                ...Style.f_color_15,
            };
        }

        if (status === "failed") {
            duration = 2000;

            style = {
                ...style,
                ...Style.bg_color_warning,
            };
        }

        if (status === "danger") {
            duration = 2000;

            style = {
                ...style,
                ...Style.bg_color_danger,
            };

            textStyle = {
                ...Style.f_color_15,
            };
        }

        Lib.showToast(message, {
            duration,
            shadowColor: Style.bg_color_gray.backgroundColor,
            style,
            textStyle,
        });

        status === "succeeded" &&
            setTimeout(() => {
                callback({
                    type: "remove",
                    payload: _.pick(data, "delivery"),
                });
            }, duration + 100);

        setDisabled(false);
        setLoading(false);
    };

    return (
        <Div
            style={[
                Style.column,
                Style.row_center,
                Style.p_v_2,
                Style.b_t_light_medium,
                Style.bg_color_15,
            ]}
            onClick={() => onClick(delivery)}
        >
            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.m_b_1,
                ]}
            >
                <Text style={[Style.f_size_13]}>{`#${Lib.chunkStr(
                    delivery.serial,
                    4
                )}`}</Text>
                <Text style={[Style.f_size_13, Style.f_color_dark]}>
                    {inDeliveryTime}
                </Text>
            </Div>
            <Div style={[Style.row, Style.row_between, Style.w_p100]}>
                <Div
                    style={[
                        Style.flex,
                        Style.row,
                        Style.column_center,
                        Style.row_between,
                        Style.b_t_15,
                    ]}
                >
                    {_.has(delivery, "fee") && (
                        <Div style={[Style.v_center]}>
                            <Text style={[Style.f_size_13, Style.f_color_dark]}>
                                {symbol}
                                {Currency(delivery.fee || 0).value}
                            </Text>
                            <Text style={[Style.f_size_13]}>
                                {trans("deliveryFee")}
                            </Text>
                        </Div>
                    )}
                    {_.has(delivery, "tip") && (
                        <Div style={[Style.v_center]}>
                            <Text style={[Style.f_size_13, Style.f_color_dark]}>
                                {symbol}
                                {Currency(delivery.tip || 0).value}
                            </Text>
                            <Text style={[Style.f_size_13]}>
                                {trans("deliveryTip")}
                            </Text>
                        </Div>
                    )}
                    {(_.has(delivery, "fee") || _.has(delivery, "tip")) && (
                        <Div style={[Style.v_center]}>
                            <Text style={[Style.f_size_13, Style.f_color_dark]}>
                                {symbol}
                                {
                                    Currency(delivery.fee || 0).add(
                                        delivery.tip || 0
                                    ).value
                                }
                            </Text>
                            <Text style={[Style.f_size_13]}>
                                {trans("total")}
                            </Text>
                        </Div>
                    )}
                </Div>
                <Div style={[Style.column, Style.row_center, Style.p_l_8]}>
                    <Button
                        size="small"
                        disabled={disabled}
                        loading={loading}
                        trans="delivery_end_delivery"
                        onPress={() =>
                            op({
                                delivery: delivery.id,
                                deliver: deliver.id,
                                status: "delivered",
                            })
                        }
                        style={[Style.bg_color_success, Style.p_1]}
                    />
                </Div>
            </Div>
        </Div>
    );
};

export default InDeliveryItem;
