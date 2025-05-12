import React, { FC, useCallback } from "react";
import _ from "lodash";
import dayjs from "dayjs";

import CurrencyModel from "model/currency";

import { redirectToOrderDetail } from "utils/navigation";

import Lib from "helpers/lib";

import Div from "components/div";
import Text from "components/text";
import Image from "components/image";

import { trans } from "locales";

import Style from "style";

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
    [key: string]: any;
};

const OrderItem: FC<Props> = (props) => {
    const { item } = props;

    const {
        createdAt,
        serial,
        items,
        currency,
        payment,
        merchant,
        shippingType,
    } = item;

    const timezone = _.get(merchant, "region.timezone", "America/Montreal");
    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);

    const clickHandler = useCallback(() => {
        redirectToOrderDetail(item);
    }, []);

    return (
        <Div
            style={[
                Style.row,
                Style.column_start,
                Style.bg_color_15,
                Style.shadow,
                Style.border_round_1,
                Style.p_3,
            ]}
            onClick={clickHandler}
        >
            {_.get(merchant, "logo.url") && (
                <Div
                    style={[
                        Style.h_center,
                        Style.overflow_hidden,
                        Style.b_img,
                        {
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        },
                    ]}
                >
                    <Image
                        src={_.get(merchant, "logo.url")}
                        alt={_.get(merchant, "name", "")}
                    />
                </Div>
            )}

            <Div style={[Style.flex, Style.column, Style.m_l_3]}>
                <Div
                    style={[Style.row, Style.column_center, Style.row_between]}
                >
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {_.get(merchant, "name", trans("deliverySource"))}
                    </Text>
                    {shippingType && (
                        <Text
                            style={[
                                Style.f_size_11,
                                Style.f_color_primary,
                                Style.f_weight_500,
                            ]}
                        >
                            {trans(`shippingType_${shippingType}`)}
                        </Text>
                    )}
                </Div>
                <Div
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_between,
                        Style.m_t_2,
                    ]}
                >
                    <Div style={[Style.column]}>
                        {serial && (
                            <Div style={[Style.row, Style.column_center]}>
                                <Text
                                    style={[
                                        Style.f_size_10,
                                        Style.f_color_dark,
                                        Style.m_r_1,
                                    ]}
                                >
                                    {trans("orderSerial")}
                                </Text>
                                <Text
                                    style={[
                                        Style.f_size_11,
                                        Style.f_color_dark,
                                    ]}
                                >
                                    {`#${Lib.chunkStr(serial, 4)}`}
                                </Text>
                            </Div>
                        )}

                        {createdAt && (
                            <Div
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.m_t_1,
                                ]}
                            >
                                <Text
                                    style={[
                                        Style.f_size_10,
                                        Style.f_color_dark,
                                        Style.m_r_1,
                                    ]}
                                >
                                    {trans("orderCreatedTime")}
                                </Text>
                                <Text
                                    style={[
                                        Style.f_size_11,
                                        Style.f_color_dark,
                                    ]}
                                >
                                    {dayjs(createdAt)
                                        .tz(timezone)
                                        .format("YYYY-MM-DD HH:mm")}
                                </Text>
                            </Div>
                        )}
                    </Div>
                    <Div
                        style={[
                            Style.column,
                            Style.column_end,
                            Style.row_center,
                        ]}
                    >
                        {_.has(payment, "amount") && (
                            <Text style={[Style.f_size_15, Style.f_weight_500]}>
                                {`${symbol}${_.get(payment, "amount")}`}
                            </Text>
                        )}
                        <Text style={[Style.f_size_10, Style.f_color_dark]}>
                            {`(${_.size(items)} ${trans(
                                _.size(items) > 1 ? "items" : "item"
                            )})`}
                        </Text>
                    </Div>
                </Div>
            </Div>
        </Div>
    );
};

export default OrderItem;
