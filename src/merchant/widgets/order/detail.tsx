import React from "react";
import _ from "lodash";
import dayjs from "dayjs";
import Currency from "currency.js";

import { IMG_WIDTH } from "config/constant";

import CurrencyModel from "model/currency";

import { CartItem } from "interfaces/cart";

import Lib from "helpers/lib";
import { useQuery, useMutation } from "helpers/apollo";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Image from "components/image";
import Button from "components/button";
import Loading from "components/loading";
import NoResultFound from "components/no-result";
import ErrorMessage from "components/error-message";

import { trans } from "locales";

import Style from "style";

import { ORDER_DETAIL } from "merchant/graphql/query";

import { UPDATE_ORDER } from "merchant/graphql/mutation";

const OrderDetail = ({ item }: any) => {
    const [updateOrderStatus] = useMutation(UPDATE_ORDER);

    const condition = {
        id: item.id,
    };

    const { data, error, loading } = useQuery(ORDER_DETAIL, condition);

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

    const handleUpdateOrderStatus = async () => {
        const res = await updateOrderStatus({
            variables: {
                id: item.id,
                data: {
                    status: "picked",
                },
            },
        });

        if (_.has(res, "data") && !_.isEmpty(res.data)) {
            sendRequestSuccess();
            // closeCallback &&
            //     closeCallback({
            //         type: "remove",
            //         payload: {
            //             id: item.id,
            //         },
            //     });
            // closeDrawer();
        } else {
            sendRequestFail();
            // closeDrawer();
        }
    };

    const sendRequestSuccess = () => {
        Lib.showToast(trans("succeeded"));
    };

    const sendRequestFail = () => {
        Lib.showToast(trans("failed"));
    };

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
        shipping,
        merchant,
    } = data.order;

    const timezone = _.get(merchant, "region.timezone", "America/Montreal");
    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);
    const total = Currency(subtotal)
        .add(totalTax)
        .subtract(discount || 0).value;

    return (
        <Div style={[Style.h_p100, Style.bg_color_15, Style.p_3]}>
            {!_.isNil(status) && status === "picked" ? (
                <Div style={[Style.row, Style.column_center, Style.m_b_3]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_color_primary,
                            Style.f_weight_500,
                        ]}
                    >
                        {trans("pickedFromMerchant")}
                    </Text>
                </Div>
            ) : (
                <Div style={[Style.row, Style.column_center, Style.m_b_3]}>
                    <Button
                        size="big"
                        onPress={() => handleUpdateOrderStatus()}
                        trans="pickedFromMerchant"
                        titleStyle={[
                            Style.f_size_15,
                            Style.f_color_15,
                            Style.f_weight_500,
                        ]}
                        style={[Style.border_round_1]}
                    />
                </Div>
            )}

            <Div style={[Style.column, Style.row_center]}>
                {shippingType === "delivery" &&
                    !_.isNil(shipping) &&
                    !_.isEmpty(shipping) &&
                    _.has(shipping, "contact") &&
                    !_.isEmpty(_.get(shipping, "contact", {})) && (
                        <Div style={[Style.column, Style.m_b_4]}>
                            <Text style={[Style.f_size_11, Style.f_weight_500]}>
                                {trans("deliveryContact")}
                            </Text>
                            <Text style={[Style.f_size_11, Style.m_t_1]}>
                                {_.get(shipping, "contact.first_name") ||
                                _.get(shipping, "contact.last_name")
                                    ? `${_.get(
                                          shipping,
                                          "contact.first_name",
                                          ""
                                      )} ${_.get(
                                          shipping,
                                          "contact.last_name",
                                          ""
                                      )}`
                                    : trans("deliveryDestination")}
                            </Text>
                            <Text style={[Style.f_size_11]}>
                                {`${Lib.getAddress(shipping.contact)}`}
                            </Text>
                            {_.get(shipping, "contact.phone") && (
                                <A
                                    onPress={() =>
                                        Lib.phone(
                                            _.get(shipping, "contact.phone", "")
                                        )
                                    }
                                >
                                    <Text
                                        style={[
                                            Style.f_size_11,
                                            Style.f_color_primary,
                                        ]}
                                    >
                                        {_.get(shipping, "contact.phone", "")}
                                    </Text>
                                </A>
                            )}
                        </Div>
                    )}

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

            {!_.isNil(items) && !_.isEmpty(items) && (
                <Div style={[Style.column, Style.row_center, Style.m_t_2]}>
                    {_.map(items, (item: CartItem, index: number) => (
                        <Div
                            key={index}
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.p_v_2,
                            ]}
                        >
                            <Div style={{ width: IMG_WIDTH }}>
                                <Image src={item.image} />
                            </Div>
                            <Div
                                style={[
                                    Style.column,
                                    Style.row_center,
                                    Style.column_start,
                                    Style.w_p70,
                                    Style.m_h_2,
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
                                        <Text style={[Style.f_size_13]}>X</Text>
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
        </Div>
    );
};

export default OrderDetail;
