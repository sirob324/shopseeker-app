import React, { FC, useEffect } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import Currency from "currency.js";
import { Steps } from "@ant-design/react-native";

import { IMG_HEIGHT, IMG_WIDTH } from "config/constant";

import CurrencyModel from "model/currency";

import { CartItem } from "interfaces/cart";

import Lib from "helpers/lib";
import { useQuery } from "helpers/apollo";

import { ORDER_DETAIL } from "graphql/query";

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

import Alipay from "assets/icon/alipay.png";
import Applepay from "assets/icon/apple-pay.png";
import Goolepay from "assets/icon/google-pay.png";

import Amex from "assets/icon/amex.png";
import Dinersclub from "assets/icon/dinersclub.png";
import Discover from "assets/icon/discover.png";
import Jcb from "assets/icon/jcb.png";
import Mastercard from "assets/icon/mastercard.png";
import Unionpay from "assets/icon/unionpay.png";
import Visa from "assets/icon/visa.png";

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
    [key: string]: any;
};

const OrderDetail: FC<Props> = (props) => {
    const { route, navigation } = props;

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

    const {
        serial,
        currency,
        subtotal,
        totalTax,
        discount,
        items,
        createdAt,
        shippingType,
        shipping,
        payment,
        merchant,
        delivery,
    } = data.order;

    const timezone = _.get(merchant, "region.timezone", "America/Montreal");
    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);

    let amount = Currency(subtotal).add(totalTax).subtract(discount).value;

    const isDelivery =
        shippingType === "delivery" &&
        !_.isNil(shipping) &&
        !_.isEmpty(shipping);

    if (isDelivery) {
        amount = Currency(amount)
            .add(_.get(shipping, "fee", 0))
            .add(_.get(shipping, "tip", 0)).value;
    }

    let payment_method_type = _.toLower(_.get(payment, "method_type"));
    let payment_method = _.get(payment, "method", {});
    let issuerLogo: any = null;

    if (payment_method_type === "apple") {
        issuerLogo = (
            <Image
                src={Applepay}
                style={{ width: 52.08, height: 21, marginLeft: 20 }}
            />
        );
    } else if (payment_method_type === "google") {
        issuerLogo = <Image src={Goolepay} />;
    } else if (payment_method_type === "alipay") {
        issuerLogo = <Image src={Alipay} />;
    } else if (payment_method_type === "card") {
        const issuer = _.toLower(_.get(payment_method, "brand", ""));

        issuerLogo = <Text>{_.upperFirst(issuer)}</Text>;

        if (issuer === "amex") {
            issuerLogo = <Image src={Amex} />;
        } else if (issuer === "dinersclub") {
            issuerLogo = <Image src={Dinersclub} />;
        } else if (issuer === "discover") {
            issuerLogo = <Image src={Discover} />;
        } else if (issuer === "jcb") {
            issuerLogo = <Image src={Jcb} />;
        } else if (issuer === "mastercard") {
            issuerLogo = <Image src={Mastercard} />;
        } else if (issuer === "unionpay") {
            issuerLogo = <Image src={Unionpay} />;
        } else if (issuer === "visa") {
            issuerLogo = <Image src={Visa} />;
        }
    }

    const card = (
        <Div style={[Style.row, Style.column_center]}>
            <Div style={[Style.v_center, { width: 26, height: 17 }]}>
                {issuerLogo}
            </Div>
            {_.has(payment_method, "last4") && (
                <Div
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_between,
                        Style.m_l_2,
                    ]}
                >
                    <Icon
                        name="asterisk"
                        size={Style.f_size_10.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Icon
                        name="asterisk"
                        size={Style.f_size_10.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Icon
                        name="asterisk"
                        size={Style.f_size_10.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_dark,
                            Style.f_weight_500,
                            Style.m_l_2,
                        ]}
                    >
                        {_.get(payment_method, "last4")}
                    </Text>
                </Div>
            )}
        </Div>
    );

    const paymentStatus = trans(
        _.get(payment, "api_status") === "succeeded"
            ? "paySuccessful"
            : _.get(payment, "api_status") === "canceled"
            ? "payCanceled"
            : "payFailed",
        {
            amount: `${symbol}${amount}`,
        }
    );

    const contact = shippingType === "delivery" &&
        !_.isNil(delivery) &&
        !_.isEmpty(delivery) &&
        !_.isEmpty(_.get(delivery, "contact")) && (
            <Div style={[Style.column]}>
                <Div style={[Style.row, Style.column_center, Style.m_b_1]}>
                    <Text style={[Style.f_size_13, Style.f_color_dark]}>
                        {`${_.get(delivery, "contact.first_name", "")} ${_.get(
                            shipping,
                            "contact.last_name",
                            ""
                        )}`}
                    </Text>
                    <A
                        onPress={() =>
                            Lib.phone(_.get(delivery, "contact.phone"))
                        }
                    >
                        <Text
                            style={[Style.f_size_13, Style.f_color_primary]}
                        >{` ${_.get(delivery, "contact.phone", "")}`}</Text>
                    </A>
                </Div>
                <Text style={[Style.f_size_13, Style.f_color_dark]}>
                    {`${Lib.getAddress(_.get(delivery, "contact"))}`}
                </Text>
            </Div>
        );

    const { Step } = Steps;

    const orderCreate = (
        <Step
            title={
                <Text style={[Style.f_size_13, Style.f_color_primary]}>
                    {trans("orderCreated", {
                        merchantName: _.get(merchant, "name"),
                    })}
                </Text>
            }
            description={
                <Div style={[Style.column]}>
                    <Div
                        style={[
                            Style.column,
                            Style.row_center,
                            Style.bg_color_light,
                            Style.m_v_1,
                            Style.p_2,
                            Style.border_round_1,
                        ]}
                    >
                        <Text style={[Style.f_size_11, Style.f_color_dark]}>
                            {`${Lib.getAddress(merchant)}`}
                        </Text>
                        {_.get(merchant, "phone") && (
                            <A onPress={() => Lib.phone(merchant.phone)}>
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
                    <Text style={[Style.f_size_10, Style.f_color_dark]}>
                        {dayjs(createdAt)
                            .tz(timezone)
                            .format("YYYY-MM-DD HH:mm")}
                    </Text>
                </Div>
            }
            renderIcon={() => (
                <Icon name="checkmark" color={Style.f_color_15.color} />
            )}
        />
    );

    const paymentFlow = (
        <Step
            title={
                <Text style={[Style.f_size_13, Style.f_color_primary]}>
                    {paymentStatus}
                </Text>
            }
            description={
                <Div
                    style={[
                        Style.column,
                        Style.row_center,
                        Style.bg_color_light,
                        Style.m_t_1,
                        Style.m_b_3,
                        Style.p_2,
                        Style.border_round_1,
                    ]}
                >
                    {card}
                </Div>
            }
            renderIcon={() => (
                <Icon name="checkmark" color={Style.f_color_15.color} />
            )}
        />
    );

    const deliveryWaiting = (
        <Step
            title={
                <Text style={[Style.f_size_13, Style.f_color_primary]}>
                    {trans("deliveryWaiting")}
                </Text>
            }
            description={
                <Div style={[Style.column, Style.m_b_3]}>
                    {!_.isEmpty(_.get(delivery, "contact", {})) && (
                        <Div
                            style={[
                                Style.column,
                                Style.row_center,
                                Style.bg_color_light,
                                Style.m_v_1,
                                Style.p_2,
                                Style.border_round_1,
                            ]}
                        >
                            {contact}
                        </Div>
                    )}
                    <Text style={[Style.f_size_10, Style.f_color_dark]}>
                        {dayjs(_.get(delivery, "createdAt"))
                            .tz(timezone)
                            .format("YYYY-MM-DD HH:mm")}
                    </Text>
                </Div>
            }
            renderIcon={() => (
                <Icon name="checkmark" color={Style.f_color_15.color} />
            )}
        />
    );

    const deliveryReceived = (
        <Step
            title={
                <Text style={[Style.f_size_13, Style.f_color_primary]}>
                    {trans("deliveryPickup", {
                        deliver: `${_.get(
                            delivery,
                            "deliver.first_name",
                            ""
                        )} ${_.get(delivery, "deliver.last_name", "")}`,
                    })}
                </Text>
            }
            description={
                <Div style={[Style.column, Style.m_b_3]}>
                    {_.has(delivery, "deliver.phone") && (
                        <Div
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.bg_color_light,
                                Style.m_v_1,
                                Style.p_2,
                                Style.border_round_1,
                            ]}
                        >
                            <Text style={[Style.f_size_11]}>
                                {trans("contactNumber") + ": "}
                            </Text>
                            <A
                                onPress={() =>
                                    Lib.phone(_.get(delivery, "deliver.phone"))
                                }
                            >
                                <Text
                                    style={[
                                        Style.f_size_11,
                                        Style.f_color_primary,
                                    ]}
                                >
                                    {_.get(delivery, "deliver.phone")}
                                </Text>
                            </A>
                        </Div>
                    )}
                    <Text style={[Style.f_size_10, Style.f_color_dark]}>
                        {dayjs(_.get(delivery, "receivedTime"))
                            .tz(timezone)
                            .format("YYYY-MM-DD HH:mm")}
                    </Text>
                </Div>
            }
            renderIcon={() => (
                <Icon name="checkmark" color={Style.f_color_15.color} />
            )}
        />
    );

    const deliveryInDelivery = (
        <Step
            title={
                <Text style={[Style.f_size_13, Style.f_color_primary]}>
                    {trans("deliveryOutof")}
                </Text>
            }
            description={
                <Div style={[Style.column, Style.m_b_3]}>
                    <Text style={[Style.f_size_10, Style.f_color_dark]}>
                        {dayjs(_.get(delivery, "inDeliveryTime"))
                            .tz(timezone)
                            .format("YYYY-MM-DD HH:mm")}
                    </Text>
                </Div>
            }
            renderIcon={() => (
                <Icon name="checkmark" color={Style.f_color_15.color} />
            )}
        />
    );

    const deliveryDelivered = (
        <Step
            title={
                <Text style={[Style.f_size_13, Style.f_color_primary]}>
                    {trans("deliveryArrived")}
                </Text>
            }
            description={
                <Div style={[Style.column, Style.m_b_3]}>
                    <Text style={[Style.f_size_10, Style.f_color_dark]}>
                        {dayjs(_.get(delivery, "deliveredTime"))
                            .tz(timezone)
                            .format("YYYY-MM-DD HH:mm")}
                    </Text>
                </Div>
            }
            renderIcon={() => (
                <Icon name="checkmark" color={Style.f_color_15.color} />
            )}
        />
    );

    const deliveryProcesses =
        _.get(delivery, "status") === "waiting" ? (
            <Steps size="small" current={3} direction="vertical">
                {deliveryWaiting}
                {paymentFlow}
                {orderCreate}
            </Steps>
        ) : _.get(delivery, "status") === "received" ? (
            <Steps size="small" current={4} direction="vertical">
                {deliveryReceived}
                {deliveryWaiting}
                {paymentFlow}
                {orderCreate}
            </Steps>
        ) : _.get(delivery, "status") === "in_delivery" ? (
            <Steps size="small" current={5} direction="vertical">
                {deliveryInDelivery}
                {deliveryReceived}
                {deliveryWaiting}
                {paymentFlow}
                {orderCreate}
            </Steps>
        ) : _.get(delivery, "status") === "delivered" ? (
            <Steps size="small" current={6} direction="vertical">
                {deliveryDelivered}
                {deliveryInDelivery}
                {deliveryReceived}
                {deliveryWaiting}
                {paymentFlow}
                {orderCreate}
            </Steps>
        ) : null;

    return (
        <Scroll
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            contentContainerStyle={[Style.bg_color_15, Style.p_4]}
        >
            {shippingType === "pickup" && (
                <Steps size="small" current={3} direction="vertical">
                    <Step
                        title={
                            <Text
                                style={[Style.f_size_13, Style.f_color_primary]}
                            >
                                {`${trans("shipping")} ${trans(
                                    "shippingType_pickup"
                                )}`}
                            </Text>
                        }
                        description={
                            <Div style={[Style.column, Style.m_b_3]}>
                                <Text
                                    style={[
                                        Style.f_size_10,
                                        Style.f_color_dark,
                                    ]}
                                >
                                    {dayjs(_.get(delivery, "deliveredTime"))
                                        .tz(timezone)
                                        .format("YYYY-MM-DD HH:mm")}
                                </Text>
                            </Div>
                        }
                        renderIcon={() => (
                            <Icon
                                name="checkmark"
                                color={Style.f_color_15.color}
                            />
                        )}
                    />
                    {paymentFlow}
                    {orderCreate}
                </Steps>
            )}

            {shippingType === "delivery" &&
                !_.isEmpty(delivery) &&
                _.has(delivery, "status") &&
                deliveryProcesses}

            <Div style={[Style.b_light_medium_dashed, Style.m_v_3]}></Div>

            <Div style={[Style.column, Style.row_center, Style.p_b_3]}>
                {serial && (
                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
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

                {delivery && _.get(delivery, "serial") && (
                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                        ]}
                    >
                        <Text style={[Style.f_size_11, Style.f_weight_500]}>
                            {trans("deliverySerial")}
                        </Text>
                        <Text style={[Style.f_size_11]}>
                            {`#${Lib.chunkStr(_.get(delivery, "serial"), 4)}`}
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

                {_.has(shipping, "fee") && (
                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                            Style.m_t_1,
                        ]}
                    >
                        <Text style={[Style.f_size_11, Style.f_weight_500]}>
                            {trans("deliveryFee")}
                        </Text>
                        <Text style={[Style.f_size_11]}>
                            {symbol}
                            {Currency(_.get(shipping, "fee", 0)).value}
                        </Text>
                    </Div>
                )}

                {_.has(shipping, "tip") && (
                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                            Style.m_t_1,
                        ]}
                    >
                        <Text style={[Style.f_size_11, Style.f_weight_500]}>
                            {trans("deliveryTip")}
                        </Text>
                        <Text style={[Style.f_size_11]}>
                            {symbol}
                            {Currency(_.get(shipping, "tip", 0)).value}
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
                        {Currency(amount || 0).value}
                    </Text>
                </Div>
            </Div>

            <Div style={[Style.b_light_medium_dashed, { height: 1 }]}></Div>

            {!_.isNil(items) && !_.isEmpty(items) && (
                <Div style={[Style.column, Style.row_center]}>
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
                                    height: IMG_HEIGHT,
                                }}
                            >
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
                                                    Style.f_size_11,
                                                    Style.f_color_dark,
                                                    Style.m_l_1,
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
                                                marginLeft: 2,
                                                marginRight: 2,
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
                                    <Div style={[Style.h_center]}>
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
                                    </Div>
                                )}
                            </Div>
                        </Div>
                    ))}
                </Div>
            )}
        </Scroll>
    );
};

export default OrderDetail;
