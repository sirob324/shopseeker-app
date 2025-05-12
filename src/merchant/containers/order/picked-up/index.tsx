import React, { useState, FC } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import Currency from "currency.js";

import CurrencyModel from "model/currency";

// import { HEADER_BAR_HEIGHT } from "config/constant";

import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
// import Select from "components/select";
import GraphqlFlatList from "components/flat-list/graphql";

import { trans } from "locales";

import Style from "style";

import Lib from "helpers/lib";

import { redirectToOrderDetail } from "utils/navigation";

import { useMerchant } from "merchant/contexts/app";

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
    [key: string]: any;
};

const OrderItem: FC<Props> = ({ merchant, item }) => {
    const {
        serial,
        createdAt,
        currency,
        subtotal,
        totalTax,
        discount,
        paymentStatus,
    } = item;

    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);

    const timezone = _.get(merchant, "region.timezone", "America/Montreal");

    const total = Currency(subtotal).add(totalTax).subtract(discount).value;

    const _paymentStatus = _.toLower(paymentStatus);

    return (
        <Div
            style={[Style.column, Style.p_2, Style.b_b_light_medium]}
            onPress={() => redirectToOrderDetail(item)}
        >
            <Div style={[Style.row, Style.row_between, Style.column_center]}>
                <Text
                    style={[Style.f_size_14, Style.f_weight_500]}
                >{`#${Lib.chunkStr(serial, 4)}`}</Text>
                <Text style={[Style.f_size_13]}>
                    {dayjs(createdAt).tz(timezone).format("YYYY-MM-DD HH:mm")}
                </Text>
            </Div>

            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.w_p100,
                    Style.m_t_2,
                ]}
            >
                <Div style={[Style.row, Style.column_center]}>
                    <Text style={[Style.f_size_13]}>{`${symbol}${total}`}</Text>
                    <Div style={[Style.p_1]}></Div>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_weight_500,
                            _paymentStatus === "succeeded"
                                ? Style.f_color_success
                                : _paymentStatus === "failed"
                                ? Style.f_color_danger
                                : _paymentStatus === "cancel"
                                ? Style.f_color_warning
                                : Style.f_color_dark,
                        ]}
                    >
                        {trans(`pay_${_paymentStatus}`)}
                    </Text>
                </Div>
                <Icon
                    name="chevron-forward"
                    size={Style.f_size_15.fontSize}
                    color={Style.f_color_dark_light.color}
                />
            </Div>
        </Div>
    );
};

const PickedUpOrderPage = () => {
    const { merchant } = useMerchant();

    // const [paymentStatus, setPaymentStatus] = useState("");

    const [sort] = useState("createdAt:desc");

    const where: { [key: string]: any } = {
        merchant: merchant.id,
        payment_null: false,
        status: "picked_up",
        paymentStatus: "succeeded",
    };

    // if (paymentStatus) {
    //     _.set(where, "paymentStatus", paymentStatus);
    // } else {
    //     delete where.paymentStatus;
    // }

    // const statusOptions = [
    //     { value: "", label: trans("input_payment_status") },
    //     { value: "succeeded", label: trans("order_status_succeeded") },
    //     { value: "failed", label: trans("order_status_failed") },
    //     { value: "cancelled", label: trans("order_status_cancelled") },
    // ];

    return (
        <Div style={[Style.column, Style.row_center, Style.h_p100]}>
            {/* <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.bg_color_15,
                    Style.shadow_bottom,
                    Style.p_h_2,
                    Style.position_relative,
                    {
                        height: HEADER_BAR_HEIGHT,
                    },
                ]}
            >
                <Select
                    options={statusOptions}
                    onChange={(value: any) => setPaymentStatus(value)}
                    value={paymentStatus}
                />
            </Div> */}

            <GraphqlFlatList
                // reloadToken={paymentStatus}
                select={[
                    "id",
                    "serial",
                    "currency",
                    "subtotal",
                    "totalTax",
                    "discount",
                    "items",
                    "createdAt",
                    "shippingType",
                    "paymentStatus",
                ]}
                from="moreOrders"
                where={where}
                order={sort}
                latest="createdAt_gt"
                renderItem={(item: any) => {
                    return <OrderItem item={item} merchant={merchant} />;
                }}
                itemType="merchant_picked_up_orders"
                stickyHeaderIndices={[0]}
            />
        </Div>
    );
};

export default PickedUpOrderPage;
