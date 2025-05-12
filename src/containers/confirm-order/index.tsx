import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import Currency from "currency.js";
import { connect } from "react-redux";
import {
    CardField,
    useStripe,
    CreatePaymentMethodResult,
    ConfirmPaymentMethodResult,
    useApplePay,
    ApplePayResult,
} from "@stripe/stripe-react-native";

import CurrencyModel from "model/currency";

import { Card } from "interfaces/profile";
import { Merchant } from "interfaces/cart";

import Config from "config";
import {
    FOOTER_BAR_HEIGHT,
    HEADER_BAR_HEIGHT,
    WINDOW_WIDTH,
} from "config/constant";

import {
    getCartShippingType,
    getCartShipping,
    setCartPaymentMethodType,
    setCartPaymentMethod,
} from "helpers/cart";
import Lib from "helpers/lib";
import { sumTaxObject } from "helpers/cart";

import { createOrder } from "request/order";

import { redirectToApp, redirectToShop } from "utils/navigation";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Modal from "components/modal";
import Image from "components/image";
import Button from "components/button";
import Scroll from "components/scroll";
import { MicroCard } from "components/payment-card/card";
import ContactCard from "components/contact-card/card";

import CardModal from "containers/checkout/card";
import MerchantCartDelivery from "containers/cart/delivery";

import { trans } from "locales";

import Style from "style";

import Alipay from "assets/icon/alipay.png";
import Applepay from "assets/icon/apple-pay.png";

import Amex from "assets/icon/amex.png";
import Mastercard from "assets/icon/mastercard.png";
import Unionpay from "assets/icon/unionpay.png";
import Visa from "assets/icon/visa.png";
import Jcb from "assets/icon/jcb.png";

type Props = {
    [key: string]: any;
};

const CardSection: FC<Props> = ({ onFocus, validation }) => {
    return (
        <Div style={[Style.column, Style.w_p100]}>
            <CardField
                style={{
                    height: 50,
                }}
                postalCodeEnabled={false}
                cardStyle={{
                    backgroundColor: Style.bg_color_15.backgroundColor,
                    borderColor: Style.f_color_dark.color,
                    borderRadius: 10,
                    textColor: Style.f_color_dark_bold.color,
                    fontSize: Style.f_size_16.fontSize,
                    placeholderColor: Style.f_color_dark.color,
                    cursorColor: Style.f_color_dark_medium.color,
                    textErrorColor: Style.f_color_danger.color,
                }}
                placeholder={{
                    number: trans("cardNumber"),
                    expiration: trans("cardExpiry"),
                    cvc: trans("cardCvc"),
                }}
                autofocus={false}
                onCardChange={({ complete }) => validation(complete)}
                onFocus={() => onFocus()}
            />
        </Div>
    );
};

const ConfirmOrder: FC<Props> = (props) => {
    const {
        region,
        profile: { user, cards, account },
        cart: {
            merchants,
            subtotalPrice,
            totalTax,
            totalDeliveryFee,
            totalDeliveryTip,
        },
        merchant,
    } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [valid, setValid] = useState<boolean>(false);

    const [shippingType, setShippingType] = useState<string>("");
    const [shipping, setShipping] = useState<{}>({});
    const [paymentMethodType, setPaymentMethodType] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<object>({});

    const [modelVisible, setModelVisible] = useState(false);
    const [modalRender, setModalRender] = useState<
        any & { hideModal?: boolean }
    >({});
    const _setModalRender = (_modalRender: any) => {
        setModalRender(_modalRender);

        if (_.get(_modalRender, "hideModal", false)) {
            setModelVisible(false);
        }
    };

    const [payment, setPayment] = useState<object>({});

    const { createPaymentMethod, confirmPayment } = useStripe();

    const isLoggedIn = _.has(user, "id") && !!_.get(user, "id");

    const currency = _.get(
        merchant,
        "region.currency",
        _.get(region, "currency", "cad")
    );

    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);

    const totalTaxValue = sumTaxObject(totalTax);

    const totalPrice =
        shippingType === "delivery"
            ? Currency(subtotalPrice)
                  .add(totalTaxValue)
                  .add(totalDeliveryFee)
                  .add(totalDeliveryTip)
                  .value.toFixed(2)
            : Currency(subtotalPrice).add(totalTaxValue).value.toFixed(2);

    const { presentApplePay, confirmApplePayPayment, isApplePaySupported } =
        useApplePay();

    useEffect(() => {
        (async () => {
            // set cart shipping type
            const _shippingType = await getCartShippingType();
            if (_shippingType) {
                setShippingType(_shippingType);
            }

            // set cart shipping
            const _shipping = await getCartShipping();
            if (_shipping) {
                setShipping(_shipping);
            }
        })();
    }, []);

    useEffect(() => {
        if (
            error !== "" ||
            shippingType === "" ||
            paymentMethodType === "" ||
            (shippingType === "delivery" && _.isEmpty(shipping)) ||
            (paymentMethodType === "card" && _.isEmpty(paymentMethod))
        ) {
            setValid(false);
        } else {
            setValid(true);
        }
    }, [error, shippingType, shipping, paymentMethodType, paymentMethod]);

    const showToast = (
        message: string,
        paymentId: string | undefined = undefined
    ) => {
        Lib.showToast(message, {
            onClose: () => {
                if (!_.isNil(paymentId) && paymentId) {
                    if (merchant && _.get(merchant, "id")) {
                        redirectToShop({
                            id: merchant.id,
                            tab: "payment",
                            pay: paymentId,
                        });
                    } else {
                        redirectToApp({
                            tab: "payment",
                            pay: paymentId,
                        });
                    }
                } else {
                    if (merchant && _.get(merchant, "id")) {
                        redirectToShop({
                            id: merchant.id,
                        });
                    } else {
                        redirectToApp();
                    }
                }
            },
        });
    };

    const submitOrder = async () => {
        const orders = _.map(merchants, (merchant: any) => {
            const items = _.map(merchant.items, (item: any) => {
                return _.pick(item, [
                    "id",
                    "title",
                    "quantity",
                    "salePrice",
                    "price",
                    "measure",
                    "measureUnit",
                    "hasTax",
                    "image",
                    "gallery",
                    "type",
                    "category",
                ]);
            });

            return {
                items,
                merchantId: _.get(merchant, "id", ""),
                taxes: _.get(merchant, "region.taxes", []),
                shipping: _.get(merchant, "shipping", {}),
            };
        });

        let requestData = {
            currency,
            orders,
            paymentProvider: Config.PAYMENT_PROVIDER,
            payment_method_type: paymentMethodType,
        };

        if (isLoggedIn && _.get(account, "id")) {
            _.set(requestData, "accountId", account.id);
        }

        if (_.get(paymentMethod, "id")) {
            _.set(requestData, "payment_method", _.get(paymentMethod, "id"));
        }

        const { status, data } = await createOrder(requestData);

        return {
            status,
            data,
        };
    };

    const _createPaymentMethod = async () => {
        let params: any = {};

        switch (paymentMethodType) {
            case "apple":
                const appleCart = [
                    {
                        label: trans("subTotal"),
                        amount: Currency(subtotalPrice)
                            .value.toFixed(2)
                            .toString(),
                        type: "final",
                    },
                    {
                        label: trans("totalTax"),
                        amount: Currency(totalTaxValue)
                            .value.toFixed(2)
                            .toString(),
                        type: "final",
                    },
                    {
                        label: trans("deliveryFee"),
                        amount: Currency(totalDeliveryFee)
                            .value.toFixed(2)
                            .toString(),
                        type: "final",
                    },
                    {
                        label: trans("deliveryTip"),
                        amount: Currency(totalDeliveryTip)
                            .value.toFixed(2)
                            .toString(),
                        type: "final",
                    },
                    {
                        label: trans("total"),
                        amount: Currency(totalPrice)
                            .value.toFixed(2)
                            .toString(),
                        type: "final",
                    },
                ];

                _.set(params, "cartItems", appleCart);
                _.set(
                    params,
                    "country",
                    _.toUpper(_.get(region, "country", "ca"))
                );
                _.set(params, "currency", _.toUpper(currency));

            case "alipay":
                _.set(params, "type", "Alipay");
                break;

            case "card":
            default:
                _.set(params, "type", "Card");
        }

        if (paymentMethodType === "apple") {
            try {
                const res: ApplePayResult = await presentApplePay(params);

                return res;
            } catch (e) {
                return {
                    error: e,
                };
            }
        } else {
            try {
                const res: CreatePaymentMethodResult =
                    await createPaymentMethod(params);

                if (_.get(res, "error") === undefined) {
                    return res.paymentMethod;
                } else {
                    return {};
                }
            } catch (e) {
                return {};
            }
        }
    };

    const _confirmPayment = async (
        client_secret: string,
        payment_method_id: string
    ) => {
        let _paymentMethod: any = {};

        if (isLoggedIn) {
            if (paymentMethodType === "card") {
                _paymentMethod = {
                    id: payment_method_id,
                };
            } else if (paymentMethodType === "apple") {
                _paymentMethod = await _createPaymentMethod();
            }
        } else {
            _paymentMethod = await _createPaymentMethod();
        }

        // need include error in response;
        if (paymentMethodType === "card") {
            if (_.isEmpty(_paymentMethod) || !_.has(_paymentMethod, "id")) {
                return {
                    error: {},
                };
            }
        } else if (paymentMethodType === "apple") {
            if (_.has(_paymentMethod, "error")) {
                return {
                    error: _.get(_paymentMethod, "error"),
                };
            } else {
                const res: any = await confirmApplePayPayment(client_secret);

                return res;
            }
        }

        let params: any = {};

        switch (paymentMethodType) {
            case "alipay":
                _.set(params, "type", "Alipay");
                break;

            case "card":
                _.set(params, "type", "Card");
                _.set(params, "paymentMethodId", _paymentMethod.id);
                break;
        }

        try {
            const res: ConfirmPaymentMethodResult = await confirmPayment(
                client_secret,
                params
            );

            if (_.get(res, "error") === undefined) {
                return res.paymentIntent;
            } else {
                return {
                    error: res.error,
                };
            }
        } catch (e) {}
    };

    const handleSubmit = async () => {
        if (!valid) {
            setError(trans("paymentFailed"));

            return;
        }

        setLoading(true);

        let error: any = {};

        let message = "";

        try {
            let client_secret = _.get(payment, "client_secret", "");
            let payment_intent_id = _.get(payment, "pii", "");
            let paymentId = _.get(payment, "id", "");
            let payment_method_id = _.get(payment, "payment_method_id", "");

            if (!!!client_secret || !!!payment_intent_id || !!!paymentId) {
                // create order, payment, res include paymentIntent client_secret and payment id
                const { status, data } = await submitOrder();

                if (status === "succeeded") {
                    setPayment({
                        client_secret: data.client_secret,
                        pii: data.pii,
                        id: data.id,
                        payment_method_id: _.get(
                            data,
                            "payment_method_id",
                            ""
                        ),
                    });

                    client_secret = data.client_secret;
                    payment_intent_id = data.pii;
                    paymentId = data.id;
                    payment_method_id = _.get(
                        data,
                        "payment_method_id",
                        ""
                    );
                } else {
                    if (data) {
                        message = data;
                    } else {
                        message = trans("pay_failed");
                    }

                    showToast(message);

                    return;
                }
            }

            // confirm payment intent base on client_secret and payment method id
            let res = await _confirmPayment(
                client_secret,
                payment_method_id
            );

            error = _.get(res, "error", null);

            if (!_.isNil(error)) {
                if (_.has(error, "message")) {
                    message = error.message;
                } else {
                    message = trans("pay_failed");
                }

                showToast(message, paymentId);

                return;
            } else {
                if (
                    _.toLower(_.get(res, "status")) === "succeeded" ||
                    paymentMethodType === "apple"
                ) {
                    showToast(trans("pay_succeeded"), paymentId);
                } else {
                    showToast(trans("pay_failed"), paymentId);
                }
            }
        } catch (error) {
            showToast(error.message || trans("pay_failed"));
        }
    };

    const showModal = () => {
        const modalRender = {
            renderHeader: () => (
                <Div style={[Style.w_p100, Style.row, Style.column_center]}>
                    <A
                        onPress={() => {
                            setModelVisible(false);
                            _setModalRender({});
                        }}
                    >
                        <Text style={[Style.f_size_13]}>{trans("cancel")}</Text>
                    </A>
                </Div>
            ),
            renderContent: () => (
                <Div style={[Style.w_p100, Style.p_3, Style.p_b_4]}>
                    <CardModal setModalRender={_setModalRender} />
                </Div>
            ),
            style: {
                container: {
                    ...Style.bg_transparent_3,
                    ...Style.h_p100,
                    ...Style.column,
                    ...Style.row_end,
                },
            },
        };

        setModelVisible(true);
        _setModalRender(modalRender);
    };

    const changePaymentMethodType = (value: string) => {
        if (!_.isEqual(value, paymentMethodType)) {
            setError("");
            setLoading(false);

            setPaymentMethodType(value);

            setCartPaymentMethodType(value);
        }
    };

    const changePaymentMethod = (value: object) => {
        if (
            _.get(value, "last4", "") !== "" &&
            !_.isEqual(
                _.get(value, "brand", "XXX") +
                    "-" +
                    _.get(value, "last4", "XXX"),
                _.get(paymentMethod, "brand", "YYY") +
                    "-" +
                    _.get(paymentMethod, "last4", "YYY")
            )
        ) {
            setPaymentMethod(value);

            setCartPaymentMethod(value);
        }
    };

    const onChange = async (name: string, data: any) => {
        if (name === "paymentMethodType") {
            changePaymentMethodType(data);
        } else if (name === "paymentMethod") {
            changePaymentMethod(data);
        }
    };

    return (
        <>
            <Scroll
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                contentContainerStyle={[
                    Style.p_h_3,
                    {
                        paddingTop: HEADER_BAR_HEIGHT + 15,
                        paddingBottom: FOOTER_BAR_HEIGHT + 15,
                    },
                ]}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="never"
            >
                {shippingType === "delivery" &&
                    !_.isNil(shipping) &&
                    !_.isEmpty(shipping) && (
                        <Div
                            style={[
                                Style.column,
                                Style.bg_color_15,
                                Style.shadow,
                                Style.border_round_2,
                                Style.p_3,
                                Style.m_b_3,
                            ]}
                        >
                            <Text
                                style={[
                                    Style.f_size_15,
                                    Style.f_weight_500,
                                    Style.m_b_2,
                                ]}
                            >
                                {trans("deliveryDetail")}
                            </Text>
                            <Div
                                style={[
                                    Style.column,
                                    Style.row_between,
                                    Style.bg_color_light,
                                    Style.p_h_2,
                                    Style.p_b_2,
                                ]}
                            >
                                {_.map(
                                    merchants,
                                    (merchant: Merchant, index: number) => (
                                        <Div
                                            key={index}
                                            style={[Style.column, Style.m_t_2]}
                                        >
                                            <Div
                                                style={[
                                                    Style.row,
                                                    Style.column_center,
                                                    Style.row_between,
                                                ]}
                                            >
                                                <Div
                                                    style={[
                                                        Style.row,
                                                        Style.column_center,
                                                    ]}
                                                >
                                                    {_.has(
                                                        merchant,
                                                        "logo"
                                                    ) && (
                                                        <Div
                                                            style={[
                                                                Style.h_center,
                                                                Style.overflow_hidden,
                                                                {
                                                                    width: 30,
                                                                    height: 30,
                                                                    borderRadius: 15,
                                                                },
                                                            ]}
                                                        >
                                                            <Image
                                                                src={
                                                                    merchant
                                                                        .logo
                                                                        .url
                                                                }
                                                            />
                                                        </Div>
                                                    )}
                                                    {_.has(
                                                        merchant,
                                                        "name"
                                                    ) && (
                                                        <Div
                                                            style={[
                                                                Style.m_l_2,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    Style.f_size_12,
                                                                    Style.f_color_dark,
                                                                ]}
                                                            >
                                                                {merchant.name}
                                                            </Text>
                                                        </Div>
                                                    )}
                                                </Div>
                                                <Div style={[Style.v_center]}>
                                                    <Text
                                                        style={[
                                                            Style.f_size_13,
                                                            Style.f_weight_500,
                                                        ]}
                                                    >
                                                        {`${trans(
                                                            "orderTitle"
                                                        )} #${index + 1}`}
                                                    </Text>
                                                </Div>
                                            </Div>
                                            <MerchantCartDelivery
                                                merchant={merchant}
                                            />
                                        </Div>
                                    )
                                )}
                            </Div>
                            <Div
                                style={[
                                    Style.row,
                                    Style.row_between,
                                    Style.column_center,
                                    Style.b_light,
                                    Style.p_2,
                                ]}
                            >
                                <ContactCard data={shipping} />
                            </Div>
                        </Div>
                    )}
                <Div
                    style={[
                        Style.column,
                        Style.bg_color_15,
                        Style.shadow,
                        Style.border_round_2,
                        Style.p_3,
                        Style.m_b_3,
                    ]}
                >
                    <Div
                        style={[
                            Style.w_p100,
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                            Style.p_v_1,
                        ]}
                    >
                        <Text style={[Style.f_size_14, Style.f_color_dark]}>
                            {trans("subTotal")}
                        </Text>
                        <Text style={[Style.f_size_14, Style.f_color_dark]}>
                            {`${symbol}${Currency(subtotalPrice).value.toFixed(
                                2
                            )}`}
                        </Text>
                    </Div>
                    {!_.isEmpty(totalTax) &&
                        Object.keys(totalTax).map(
                            (name: string, index: number) => (
                                <Div
                                    key={index}
                                    style={[
                                        Style.w_p100,
                                        Style.row,
                                        Style.column_center,
                                        Style.row_between,
                                        Style.p_v_1,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            Style.f_size_14,
                                            Style.f_color_dark,
                                        ]}
                                    >
                                        {trans(`tax_${name}`)}
                                    </Text>
                                    <Text
                                        style={[
                                            Style.f_size_14,
                                            Style.f_color_dark,
                                        ]}
                                    >
                                        {`${symbol}${Currency(
                                            totalTax[name]
                                        ).value.toFixed(2)}`}
                                    </Text>
                                </Div>
                            )
                        )}
                    {shippingType === "delivery" && (
                        <Div>
                            <Div
                                style={[
                                    Style.w_p100,
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
                                    Style.p_v_1,
                                ]}
                            >
                                <Text
                                    style={[
                                        Style.f_size_14,
                                        Style.f_color_dark,
                                    ]}
                                >
                                    {trans("deliveryFee")}
                                </Text>
                                <Text
                                    style={[
                                        Style.f_size_14,
                                        Style.f_color_dark,
                                    ]}
                                >
                                    {`${symbol}${Currency(
                                        totalDeliveryFee
                                    ).value.toFixed(2)}`}
                                </Text>
                            </Div>
                            <Div
                                style={[
                                    Style.w_p100,
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
                                    Style.p_v_1,
                                ]}
                            >
                                <Text
                                    style={[
                                        Style.f_size_14,
                                        Style.f_color_dark,
                                    ]}
                                >
                                    {trans("deliveryTip")}
                                </Text>
                                <Text
                                    style={[
                                        Style.f_size_14,
                                        Style.f_color_dark,
                                    ]}
                                >
                                    {`${symbol}${Currency(
                                        totalDeliveryTip
                                    ).value.toFixed(2)}`}
                                </Text>
                            </Div>
                        </Div>
                    )}
                    <Div
                        style={[
                            Style.w_p100,
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                            Style.p_v_1,
                        ]}
                    >
                        <Text style={[Style.f_size_14, Style.f_color_dark]}>
                            {trans("total")}
                        </Text>
                        <Text style={[Style.f_size_14, Style.f_color_dark]}>
                            {`${symbol}${totalPrice}`}
                        </Text>
                    </Div>
                </Div>

                <Div
                    style={[
                        Style.column,
                        Style.bg_color_15,
                        Style.shadow,
                        Style.border_round_2,
                        Style.p_3,
                    ]}
                >
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_weight_500,
                            Style.m_b_2,
                        ]}
                    >
                        {trans("choosePaymentMethod")}
                    </Text>
                    <Div style={[Style.column, Style.m_b_2]}>
                        <Div style={[Style.row, Style.column_center]}>
                            {isApplePaySupported && (
                                <A
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        paymentMethodType === "apple" &&
                                            Style.bg_color_light,
                                        Style.p_v_2,
                                        Style.p_h_3,
                                        Style.border_round_2,
                                    ]}
                                    onPress={() =>
                                        onChange("paymentMethodType", "apple")
                                    }
                                >
                                    <Image
                                        src={Applepay}
                                        style={{ width: 35, height: 22.41 }}
                                    />
                                </A>
                            )}

                            <A
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    paymentMethodType === "alipay" &&
                                        Style.bg_color_light,
                                    Style.p_v_2,
                                    Style.p_h_3,
                                    Style.border_round_2,
                                ]}
                                onPress={() =>
                                    onChange("paymentMethodType", "alipay")
                                }
                            >
                                <Image
                                    src={Alipay}
                                    style={{ width: 32, height: 21 }}
                                />
                                <Text style={[Style.f_size_14, Style.m_l_1]}>
                                    {trans("alipayPay")}
                                </Text>
                            </A>
                        </Div>

                        <Div
                            style={[
                                Style.column,
                                Style.row_center,
                                paymentMethodType === "card" &&
                                    Style.bg_color_light,
                                Style.m_t_1,
                                Style.p_2,
                            ]}
                        >
                            <Div
                                style={[
                                    Style.column,
                                    Style.row_center,
                                    Style.column_start,
                                ]}
                                onClick={() =>
                                    onChange("paymentMethodType", "card")
                                }
                            >
                                <Div
                                    style={[
                                        Style.w_p100,
                                        Style.row,
                                        Style.column_center,
                                    ]}
                                >
                                    <Image
                                        src={Visa}
                                        style={{ width: 32, height: 21 }}
                                    />
                                    <Div style={[Style.p_l_2]}></Div>
                                    <Image
                                        src={Mastercard}
                                        style={{ width: 32, height: 21 }}
                                    />
                                    <Div style={[Style.p_l_2]}></Div>
                                    <Image
                                        src={Unionpay}
                                        style={{ width: 32, height: 21 }}
                                    />
                                    <Div style={[Style.p_l_2]}></Div>
                                    <Image
                                        src={Jcb}
                                        style={{ width: 32, height: 21 }}
                                    />
                                    <Div style={[Style.p_l_2]}></Div>
                                    <Image
                                        src={Amex}
                                        style={{ width: 32, height: 21 }}
                                    />
                                    {/* <Div style={[Style.p_l_1]}></Div>
                                <Image
                                    src={Discover}
                                    style={{ width: 32, height: 21 }}
                                />
                                <Div style={[Style.p_l_1]}></Div>
                                <Image
                                    src={Dinersclub}
                                    style={{ width: 32, height: 21 }}
                                /> */}
                                </Div>
                                <Text
                                    style={[
                                        Style.f_size_11,
                                        Style.f_color_dark,
                                        Style.f_weight_500,
                                        Style.m_t_1,
                                    ]}
                                >
                                    {trans("cardWithVisaAndMastercard")}
                                </Text>
                            </Div>
                            {paymentMethodType === "card" && (
                                <Div style={[Style.column]}>
                                    {isLoggedIn &&
                                        !_.isEmpty(cards) &&
                                        _.map(
                                            cards,
                                            (card: Card, index: number) => (
                                                <A
                                                    key={index}
                                                    onPress={() =>
                                                        onChange(
                                                            "paymentMethod",
                                                            card
                                                        )
                                                    }
                                                    style={[
                                                        Style.row,
                                                        Style.column_center,
                                                        Style.row_start,
                                                        Style.m_t_2,
                                                        Style.p_2,
                                                        Style.bg_color_15,
                                                        Style.border_round_1,
                                                        Style.b_light_medium,
                                                    ]}
                                                >
                                                    <Div style={[Style.row]}>
                                                        {_.isEqual(
                                                            _.get(
                                                                card,
                                                                "brand",
                                                                "XXX"
                                                            ) +
                                                                "-" +
                                                                _.get(
                                                                    card,
                                                                    "last4",
                                                                    "XXX"
                                                                ),
                                                            _.get(
                                                                paymentMethod,
                                                                "brand",
                                                                "YYY"
                                                            ) +
                                                                "-" +
                                                                _.get(
                                                                    paymentMethod,
                                                                    "last4",
                                                                    "YYY"
                                                                )
                                                        ) ? (
                                                            <Icon
                                                                name="checkmark-circle"
                                                                size={
                                                                    Style
                                                                        .f_size_20
                                                                        .fontSize
                                                                }
                                                                color={
                                                                    Style
                                                                        .f_color_success
                                                                        .color
                                                                }
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name="checkmark-circle-outline"
                                                                size={
                                                                    Style
                                                                        .f_size_20
                                                                        .fontSize
                                                                }
                                                                color={
                                                                    Style
                                                                        .f_color_dark_light
                                                                        .color
                                                                }
                                                            />
                                                        )}
                                                    </Div>
                                                    <Div
                                                        style={[
                                                            Style.m_l_2,
                                                            Style.column,
                                                            Style.row_center,
                                                            Style.column_start,
                                                        ]}
                                                    >
                                                        <MicroCard {...card} />
                                                    </Div>
                                                </A>
                                            )
                                        )}

                                    {isLoggedIn ? (
                                        <A
                                            onPress={() => showModal()}
                                            style={[
                                                Style.row,
                                                Style.column_center,
                                                Style.row_start,
                                                Style.bg_color_15,
                                                Style.border_round_1,
                                                Style.b_light_medium,
                                                Style.m_t_2,
                                                Style.p_2,
                                            ]}
                                        >
                                            <Icon
                                                name="add-circle-outline"
                                                size={Style.f_size_20.fontSize}
                                                color={Style.f_color_dark.color}
                                            />
                                            <Text
                                                style={[
                                                    Style.f_size_13,
                                                    Style.m_l_2,
                                                ]}
                                            >
                                                {trans("addCreditOrDebitCard")}
                                            </Text>
                                        </A>
                                    ) : (
                                        <Div
                                            style={[
                                                Style.w_p100,
                                                Style.row,
                                                Style.v_center,
                                                Style.m_t_1,
                                            ]}
                                        >
                                            <CardSection
                                                onFocus={() => setError("")}
                                                validation={(
                                                    isValid: boolean
                                                ) => {
                                                    setValid(isValid);
                                                }}
                                            />
                                        </Div>
                                    )}
                                </Div>
                            )}
                        </Div>
                    </Div>
                </Div>

                <Div
                    style={[
                        Style.w_p100,
                        Style.row,
                        Style.column_center,
                        Style.row_start,
                        Style.m_t_3,
                    ]}
                >
                    <Text style={[Style.f_size_13, Style.f_color_danger]}>
                        {error}
                    </Text>
                </Div>

                <Div style={[Style.column]}>
                    {isLoggedIn && (
                        <Modal
                            transparent={true}
                            visible={modelVisible}
                            animationType="fade"
                            presentationStyle="overFullScreen"
                            {...modalRender}
                        />
                    )}
                </Div>
            </Scroll>
            {(isLoggedIn ||
                _.includes(
                    ["apple", "google", "alipay"],
                    paymentMethodType
                )) && (
                <Div
                    style={[
                        Style.bottom_horizontal,
                        Style.bg_color_15,
                        Style.shadow_top,
                    ]}
                >
                    <Button
                        size="fullwidth"
                        trans="payNow"
                        disabled={!valid || loading}
                        loading={loading}
                        onPress={handleSubmit}
                        style={[
                            Style.m_v_2,
                            Style.p_v_3,
                            { width: WINDOW_WIDTH - 20 },
                        ]}
                    />
                </Div>
            )}

            {!isLoggedIn && paymentMethodType === "card" && (
                <Div
                    style={[
                        Style.bottom_horizontal,
                        Style.bg_color_15,
                        Style.shadow_top,
                    ]}
                >
                    <Button
                        size="fullwidth"
                        trans="payNow"
                        disabled={!valid || loading}
                        loading={loading}
                        onPress={handleSubmit}
                        style={[
                            Style.m_v_2,
                            Style.p_v_3,
                            { width: WINDOW_WIDTH - 20 },
                        ]}
                    />
                </Div>
            )}
        </>
    );
};

const mapStateToProps = (state: any) => {
    return {
        locale: state.system.locale,
        profile: state.profile,
        region: state.region,
        cart: state.cart
    };
};

export default connect(mapStateToProps)(ConfirmOrder);
