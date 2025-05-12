import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import Currency from "currency.js";

import CurrencyModel from "model/currency";

import { getDeliverySummary } from "deliver/request";

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

const DeliverySummary: FC<Props> = ({ deliver }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");

    const requestData = async () => {
        setLoading(true);

        const res = await getDeliverySummary({
            deliverId: deliver.id,
            select: ["deliveredTime", "fee", "tip", "currency"],
            where: {
                deliver: deliver.id,
                status: "delivered",
                deliveredTime_gte: moment
                    .utc()
                    .subtract(90, "days")
                    .toISOString(),
                _sort: "deliveredTime:desc",
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

            _.forEach(data, (delivery: any) => {
                const deliveredTime = delivery.deliveredTime;
                const isToday = moment
                    .utc(deliveredTime)
                    .isSame(moment.utc(), "day");
                const isYestoday = moment
                    .utc(deliveredTime)
                    .isSame(yestodayDate, "day");

                if (_.gte(deliveredTime, last90DaysDate)) {
                    last90Days.push(delivery);
                }

                if (_.gte(deliveredTime, last30DaysDate)) {
                    last30Days.push(delivery);
                }

                if (_.gte(deliveredTime, last15DaysDate)) {
                    last15Days.push(delivery);
                }

                if (_.gte(deliveredTime, last7DaysDate)) {
                    last7Days.push(delivery);
                }

                if (isYestoday) {
                    yestoday.push(delivery);
                }

                if (isToday) {
                    today.push(delivery);
                }
            });

            const deliveries: any[] = [];

            if (!_.isEmpty(today)) {
                deliveries.push({
                    title: trans("today"),
                    list: today,
                });
            }

            if (!_.isEmpty(yestoday)) {
                deliveries.push({
                    title: trans("yestoday"),
                    list: yestoday,
                });
            }

            if (!_.isEmpty(last7Days)) {
                deliveries.push({
                    title: trans("last7days"),
                    list: last7Days,
                });
            }

            if (!_.isEmpty(last15Days)) {
                deliveries.push({
                    title: trans("last15days"),
                    list: last15Days,
                });
            }

            if (!_.isEmpty(last30Days)) {
                deliveries.push({
                    title: trans("last30days"),
                    list: last30Days,
                });
            }

            if (!_.isEmpty(last90Days)) {
                deliveries.push({
                    title: trans("last90days"),
                    list: last90Days,
                });
            }

            !_.isEmpty(deliveries) &&
                _.forEach(deliveries, (value: any, key: string) => {
                    const total = _.reduce(
                        value.list,
                        (res: number, value: any) => {
                            if (_.has(value, "fee")) {
                                res = Currency(value.fee || 0).add(res).value;
                            }

                            if (_.has(value, "tip")) {
                                res = Currency(value.tip || 0).add(res).value;
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
                    {trans("navlinkDelivery")}
                </Text>
                <A onPress={() => requestData()} style={[{ height: 20 }]}>
                    <Icon name="refresh" size={Style.f_size_20.fontSize} />
                </A>
            </Div>
            {renderView()}
        </Div>
    );
};

export default DeliverySummary;
