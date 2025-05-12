import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import Currency from "currency.js";

import CurrencyModel from "model/currency";

import { getSalesSummary } from "merchant/request";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Loading from "components/loading";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const SalesSummary: FC<Props> = ({ merchant }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");

    const requestData = async () => {
        setLoading(true);

        const res = await getSalesSummary({
            merchantId: merchant.id,
            select: [
                "createdAt",
                "subtotal",
                "totalTax",
                "discount",
                "currency",
            ],
            where: {
                merchant: merchant.id,
                paymentStatus: "succeeded",
                createdAt_gte: moment.utc().subtract(90, "days").toISOString(),
                _sort: "createdAt:desc",
            },
        });

        if (_.has(res, "status") && res.status === "failed") {
            setMessage(trans("noResultFound"));
        } else {
            setData(res.data);
        }

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        requestData();
    }, []);

    const renderView = () => {
        let views: any[] = [];

        if (message !== "") {
            return (
                <Div
                    style={[
                        Style.w_p100,
                        Style.b_warning,
                        Style.bg_color_warning,
                        Style.p_2,
                    ]}
                >
                    <Text style={[Style.f_size_13, Style.f_color_3]}>
                        {message}
                    </Text>
                </Div>
            );
        }

        if (!_.isEmpty(data)) {
            const today: any[] = [];
            const yestoday: any[] = [];
            const yestodayDate = moment.utc().subtract(1, "days").toISOString();
            const last7Days: any[] = [];
            const last7DaysDate = moment
                .utc()
                .subtract(7, "days")
                .toISOString();
            const last15Days: any[] = [];
            const last15DaysDate = moment
                .utc()
                .subtract(15, "days")
                .toISOString();
            const last30Days: any[] = [];
            const last30DaysDate = moment
                .utc()
                .subtract(30, "days")
                .toISOString();

            const last90Days: any[] = [];
            const last90DaysDate = moment
                .utc()
                .subtract(90, "days")
                .toISOString();

            _.forEach(data, (order: any) => {
                const createdAt = order.createdAt;
                const isToday = moment
                    .utc(createdAt)
                    .isSame(moment.utc(), "day");
                const isYestoday = moment
                    .utc(createdAt)
                    .isSame(yestodayDate, "day");

                if (_.gte(createdAt, last90DaysDate)) {
                    last90Days.push(order);
                }

                if (_.gte(createdAt, last30DaysDate)) {
                    last30Days.push(order);
                }

                if (_.gte(createdAt, last15DaysDate)) {
                    last15Days.push(order);
                }

                if (_.gte(createdAt, last7DaysDate)) {
                    last7Days.push(order);
                }

                if (isYestoday) {
                    yestoday.push(order);
                }

                if (isToday) {
                    today.push(order);
                }
            });

            const orders: any[] = [];

            if (!_.isEmpty(today)) {
                orders.push({
                    title: trans("today"),
                    list: today,
                });
            }

            if (!_.isEmpty(yestoday)) {
                orders.push({
                    title: trans("yestoday"),
                    list: yestoday,
                });
            }

            if (!_.isEmpty(last7Days)) {
                orders.push({
                    title: trans("last7days"),
                    list: last7Days,
                });
            }

            if (!_.isEmpty(last15Days)) {
                orders.push({
                    title: trans("last15days"),
                    list: last15Days,
                });
            }

            if (!_.isEmpty(last30Days)) {
                orders.push({
                    title: trans("last30days"),
                    list: last30Days,
                });
            }

            if (!_.isEmpty(last90Days)) {
                orders.push({
                    title: trans("last90days"),
                    list: last90Days,
                });
            }

            !_.isEmpty(orders) &&
                _.forEach(orders, (value: any, key: string) => {
                    const total = _.reduce(
                        value.list,
                        (res: number, value: any) => {
                            if (_.has(value, "totalTax")) {
                                res = Currency(value.subtotal || 0)
                                    .add(value.totalTax || 0)
                                    .add(res).value;
                            }

                            if (_.has(value, "discount")) {
                                res = Currency(value.subtotal || 0)
                                    .subtract(value.discount || 0)
                                    .add(res).value;
                            }

                            return res;
                        },
                        0
                    );

                    const size = _.size(value.list);

                    views.push(
                        <Div
                            key={key}
                            style={[Style.v_center, Style.w_p50, Style.p_2]}
                        >
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_dark_bold,
                                    Style.f_weight_500,
                                ]}
                            >
                                {value.title}
                            </Text>
                            {loading ? (
                                <Div style={[Style.h_center, Style.p_t_2]}>
                                    <Loading />
                                </Div>
                            ) : (
                                <Div style={[Style.h_center, Style.p_t_2]}>
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_color_dark_bold,
                                            Style.f_weight_500,
                                        ]}
                                    >
                                        {size > 1
                                            ? `${size} ${trans("items")}`
                                            : `${size} ${trans("item")}`}
                                    </Text>
                                    <Div
                                        style={[
                                            Style.h_center,
                                            Style.bg_color_blue_light,
                                            Style.border_round_1,
                                            Style.m_l_2,
                                            Style.p_h_1,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                                Style.f_color_blue,
                                            ]}
                                        >
                                            {_.get(
                                                CurrencyModel,
                                                `code.${_.toUpper(
                                                    value.list[0].currency
                                                )}.symbol`
                                            )}
                                            {total || 0}
                                        </Text>
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                                Style.f_color_blue,
                                                Style.m_l_1,
                                            ]}
                                        >
                                            {_.toUpper(value.list[0].currency)}
                                        </Text>
                                    </Div>
                                </Div>
                            )}
                        </Div>
                    );
                });
        }

        return (
            <Div
                style={[
                    Style.w_p100,
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.wrap,
                    Style.bg_color_light,
                ]}
            >
                {views}
            </Div>
        );
    };

    return (
        <Div style={[Style.column, Style.row_center]}>
            <Div style={[Style.row, Style.column_center, Style.p_2]}>
                <Text
                    style={[Style.f_size_15, Style.f_weight_500, Style.p_r_2]}
                >
                    {trans("navlinkOrder")}
                </Text>
                <A onPress={() => requestData()} style={[{ height: 20 }]}>
                    <Icon name="refresh" size={Style.f_size_20.fontSize} />
                </A>
            </Div>
            {renderView()}
        </Div>
    );
};

export default SalesSummary;
