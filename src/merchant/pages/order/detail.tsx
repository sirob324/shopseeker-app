import React, { FC, useEffect } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import Currency from "currency.js";
import { Steps } from "@ant-design/react-native";

import { IMG_WIDTH } from "config/constant";

import CurrencyModel from "model/currency";

import { CartItem } from "interfaces/cart";

import Lib from "helpers/lib";
import { useQuery } from "helpers/apollo";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Image from "components/image";
import Scroll from "components/scroll";
import Loading from "components/loading";
import NoResultFound from "components/no-result";
import ErrorMessage from "components/error-message";

import { trans } from "locales";

import Style from "style";

import { ORDER_DETAIL } from "merchant/graphql/query";

type Props = {
    [key: string]: any;
};

const OrderDetail: FC<Props> = ({ route, navigation }) => {
    const { item } = route.params;

    const condition = {
        id: item.id,
    };

    const { data, error, loading } = useQuery(ORDER_DETAIL, condition);

    useEffect(() => {
        if (_.get(data, "order.serial")) {
            navigation.setOptions({
                title: `#${Lib.chunkStr(data.order.serial, 4)}`,
            });
        }
    }, [data]);

    if (loading) {
        return (
            <Div style={[Style.v_center, Style.h_p100]}>
                <Loading />
            </Div>
        );
    }

    if (error) return <ErrorMessage message={error.message} />;

    if (_.isEmpty(_.get(data, "order", {}))) {
        return (
            <Div style={[Style.v_center]}>
                <NoResultFound />
            </Div>
        );
    }

    const { Step } = Steps;

    const {
        status,
        serial,
        items,
        currency,
        subtotal,
        totalTax,
        discount,
        createdAt,
        shippingType,
        shipping: { contact },
        merchant,
    } = data.order;

    const timezone = _.get(merchant, "region.timezone", "America/Montreal");
    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);
    const total = Currency(subtotal)
        .add(totalTax)
        .subtract(discount || 0).value;

    const statuses = [
        "ready_to_pick",
        "picking",
        "ready_to_pick_up",
        "picked_up",
    ];

    return (
        <Div style={[Style.bg_color_15, Style.h_p100]}>
            <Scroll contentContainerStyle={[Style.bg_color_15, Style.p_4]}>
                <Div style={[Style.v_center, Style.m_b_4]}>
                    <Div
                        style={[
                            Style.v_center,
                            Style.bg_color_light,
                            // Style.b_13,
                            Style.p_6,
                            { width: 140, height: 140, borderRadius: 70 },
                        ]}
                    >
                        <Text
                            style={[
                                Style.f_size_16,
                                Style.f_color_success,
                                Style.f_weight_600,
                            ]}
                        >
                            {trans("orderStatus")}
                        </Text>
                        <Text
                            style={[
                                Style.text_center,
                                Style.m_t_2,
                                Style.f_color_dark_bold,
                                Style.f_weight_500,
                            ]}
                        >
                            {trans(`order_status_${status}`)}
                        </Text>
                    </Div>
                </Div>
                {shippingType === "delivery" &&
                    !_.isNil(contact) &&
                    !_.isEmpty(contact) && (
                        <Steps size="small" current={2} direction="vertical">
                            <Step
                                title={
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_500,
                                        ]}
                                    >
                                        {_.get(
                                            merchant,
                                            "name",
                                            trans("deliverySource")
                                        )}
                                    </Text>
                                }
                                description={
                                    <Div
                                        style={[
                                            Style.column,
                                            Style.row_center,
                                            Style.m_v_1,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                Style.f_size_11,
                                                Style.m_v_1,
                                            ]}
                                        >
                                            {`${Lib.getAddress(merchant)}`}
                                        </Text>
                                        {_.get(merchant, "phone") && (
                                            <A
                                                onPress={() =>
                                                    Lib.phone(merchant.phone)
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        Style.f_size_11,
                                                        Style.f_color_primary,
                                                    ]}
                                                >
                                                    {merchant.phone}
                                                </Text>
                                            </A>
                                        )}
                                    </Div>
                                }
                                renderIcon={() => (
                                    <Icon
                                        name="checkmark"
                                        color={Style.f_color_15.color}
                                    />
                                )}
                            />
                            <Step
                                title={
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_500,
                                        ]}
                                    >
                                        {_.get(contact, "first_name") ||
                                        _.get(contact, "last_name")
                                            ? `${_.get(
                                                  contact,
                                                  "first_name",
                                                  ""
                                              )} ${_.get(
                                                  contact,
                                                  "last_name",
                                                  ""
                                              )}`
                                            : trans("deliveryDestination")}
                                    </Text>
                                }
                                description={
                                    <Div
                                        style={[
                                            Style.column,
                                            Style.row_center,
                                            Style.m_b_2,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                Style.f_size_11,
                                                Style.m_v_1,
                                            ]}
                                        >
                                            {`${Lib.getAddress(contact)}`}
                                        </Text>
                                        {_.get(contact, "phone") && (
                                            <A
                                                onPress={() =>
                                                    Lib.phone(contact.phone)
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        Style.f_size_11,
                                                        Style.f_color_primary,
                                                    ]}
                                                >
                                                    {contact.phone}
                                                </Text>
                                            </A>
                                        )}
                                    </Div>
                                }
                                renderIcon={() => (
                                    <Icon
                                        name="checkmark"
                                        color={Style.f_color_15.color}
                                    />
                                )}
                            />
                        </Steps>
                    )}

                <Div
                    style={[
                        Style.column,
                        Style.row_center,
                        Style.m_t_2,
                        Style.p_b_3,
                    ]}
                >
                    {serial && (
                        <Div
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.bg_color_light_medium,
                                Style.p_1,
                            ]}
                        >
                            <Text style={[Style.f_size_11, Style.f_weight_500]}>
                                {trans("orderSerial")}
                            </Text>
                            <Text style={[Style.f_size_11]}>
                                {`#${Lib.chunkStr(serial, 4)}`}
                            </Text>
                        </Div>
                    )}

                    {createdAt && (
                        <Div
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_1,
                            ]}
                        >
                            <Text style={[Style.f_size_11, Style.f_weight_500]}>
                                {trans("orderCreatedTime")}
                            </Text>
                            <Text style={[Style.f_size_11]}>
                                {dayjs
                                    .tz(createdAt, timezone)
                                    .format("YYYY-MM-DD HH:mm")}
                            </Text>
                        </Div>
                    )}

                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                            Style.m_t_1,
                        ]}
                    >
                        <Text style={[Style.f_size_11, Style.f_weight_500]}>
                            {trans("subTotal")}
                        </Text>
                        <Text style={[Style.f_size_11]}>
                            {symbol}
                            {Currency(subtotal || 0).value}
                        </Text>
                    </Div>

                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                            Style.m_t_1,
                        ]}
                    >
                        <Text style={[Style.f_size_11, Style.f_weight_500]}>
                            {trans("totalTax")}
                        </Text>
                        <Text style={[Style.f_size_11]}>
                            {symbol}
                            {Currency(totalTax || 0).value}
                        </Text>
                    </Div>

                    {_.toNumber(discount) > 0 && (
                        <Div
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_between,
                                Style.m_t_1,
                            ]}
                        >
                            <Text style={[Style.f_size_11, Style.f_weight_500]}>
                                {trans("discount")}
                            </Text>
                            <Text style={[Style.f_size_11]}>
                                {symbol}
                                {Currency(discount || 0).value}
                            </Text>
                        </Div>
                    )}

                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                            Style.m_t_1,
                        ]}
                    >
                        <Text style={[Style.f_size_11, Style.f_weight_500]}>
                            {trans("total")}
                        </Text>
                        <Text style={[Style.f_size_11]}>
                            {symbol}
                            {Currency(total || 0).value}
                        </Text>
                    </Div>
                </Div>

                <Div style={[Style.b_light_medium_dashed, Style.m_b_2]}></Div>

                {!_.isNil(items) && !_.isEmpty(items) && (
                    <Div
                        style={[
                            Style.column,
                            Style.row_center,
                            Style.bg_color_15,
                        ]}
                    >
                        {_.map(items, (item: CartItem, index: number) => (
                            <Div
                                key={index}
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.p_v_2,
                                ]}
                            >
                                <Div
                                    style={{
                                        width: IMG_WIDTH,
                                        height: IMG_WIDTH,
                                    }}
                                >
                                    <Image src={item.image} />
                                </Div>
                                <Div
                                    style={[
                                        Style.flex,
                                        Style.column,
                                        Style.row_center,
                                        Style.column_start,
                                        Style.p_h_2,
                                    ]}
                                >
                                    {_.get(item, "title") && (
                                        <Text
                                            style={[
                                                Style.f_size_11,
                                                Style.f_weight_500,
                                            ]}
                                        >
                                            {_.get(item, "title")}
                                            {_.get(item, "hasTax") && (
                                                <Text
                                                    style={[
                                                        Style.m_l_1,
                                                        Style.f_size_11,
                                                        Style.f_color_dark,
                                                    ]}
                                                >
                                                    ({trans("freeTax")})
                                                </Text>
                                            )}
                                        </Text>
                                    )}
                                    <Div
                                        style={[
                                            Style.row,
                                            Style.column_center,
                                            Style.m_t_1,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                Style.f_size_11,
                                                Style.f_weight_500,
                                            ]}
                                        >
                                            {`${symbol}${
                                                item.salePrice || item.price
                                            }`}
                                        </Text>
                                        <Text
                                            style={[
                                                Style.f_size_11,
                                                {
                                                    marginHorizontal: 2,
                                                },
                                            ]}
                                        >{`/`}</Text>
                                        <Text
                                            style={[
                                                Style.f_size_11,
                                                Style.f_weight_500,
                                            ]}
                                        >
                                            {`${
                                                item.measure && item.measureUnit
                                                    ? item.measure +
                                                      trans(
                                                          `measure_unit_${_.toUpper(
                                                              item.measureUnit
                                                          )}`
                                                      )
                                                    : ""
                                            }`}
                                        </Text>
                                    </Div>
                                </Div>
                                <Div
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.row_end,
                                    ]}
                                >
                                    {_.get(item, "quantity") && (
                                        <>
                                            <Text style={[Style.f_size_13]}>
                                                X
                                            </Text>
                                            <Text
                                                style={[
                                                    Style.f_size_13,
                                                    Style.f_color_first,
                                                    Style.f_weight_500,
                                                    Style.m_l_1,
                                                ]}
                                            >
                                                {_.get(item, "quantity", 1)}
                                            </Text>
                                        </>
                                    )}
                                </Div>
                            </Div>
                        ))}
                    </Div>
                )}
            </Scroll>
        </Div>
    );
};

export default OrderDetail;
