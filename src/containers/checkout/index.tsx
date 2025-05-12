import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import Currency from "currency.js";
import { connect } from "react-redux";

import {
    WINDOW_WIDTH,
    HEADER_BAR_HEIGHT,
    FOOTER_BAR_HEIGHT,
} from "config/constant";

import TipModel from "model/tip";
import CurrencyModel from "model/currency";

import { Contact } from "interfaces/profile";

import {
    calculateSubtotalPrice,
    calculateDeliveryDistance,
    calculateDeliveryDuration,
    calculateDeliveryFee,
    getCartShippingType,
    setCartShippingType,
    getCartShipping,
    setCartShipping,
    getCartShippingTip,
    setCartShippingTip,
} from "helpers/cart";
import Lib from "helpers/lib";

import { distance } from "request/delivery";

import { updateMerchantRequest } from "actions/cart";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Modal from "components/modal";
import Button from "components/button";
import Scroll from "components/scroll";

import Tip from "containers/cart/tip";
import ContactModal from "containers/checkout/contact";
import ContactGuestModal from "containers/checkout/contact_guest";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const CheckoutOrder: FC<Props> = (props) => {
    const {
        region: { currency, country },
        profile: { user, addresses },
        cart: { merchants, subtotalPrice },
        update_merchant,
        changeNav,
    } = props;

    const isLoggedIn: boolean = !!_.get(user, "id");

    const tipModel = _.get(TipModel, _.toUpper(country), { default: 0.1 });

    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [valid, setValid] = useState(true);

    const [shippingType, setShippingType] = useState<string>("");
    const [shipping, setShipping] = useState<{}>({});
    const [shippingTip, setShippingTip] = useState<number>(tipModel.default);

    const [modelVisible, setModelVisible] = useState(false);
    const [modalRender, setModalRender] = useState<any>({});
    const _setModalRender = (_modalRender: any) => {
        setModalRender(_modalRender);

        if (_.get(_modalRender, "hideModal", false)) {
            setModelVisible(false);
        }
    };

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

            // set cart shipping tip
            const _shippingTip = await getCartShippingTip();
            if (_shippingTip) {
                setShippingTip(_shippingTip);
            }
        })();
    }, []);

    useEffect(() => {
        if (error !== "") {
            setValid(false);
        } else if (_.isEmpty(merchants)) {
            setValid(false);
        } else if (shippingType === "") {
            setValid(false);
        } else if (shippingType === "delivery" && _.isEmpty(shipping)) {
            setValid(false);
        } else {
            setValid(true);
        }

        // setValid(!_.isEmpty(merchants) && error === "" && shippingType !== "");

        // shippingType === "delivery" && _.isEmpty(shipping) && setValid(false);
    }, [error, shippingType, shipping, merchants]);

    const handleSubmit = async () => {
        setLoading(true);

        if (
            shippingType === "delivery" &&
            (_.isNil(shipping) || _.isEmpty(shipping))
        ) {
            setValid(false);
        }

        if (valid) {
            if (shippingType == "pickup") {
                for (const merchant of _.values(merchants)) {
                    update_merchant({
                        id: merchant.id,
                        shipping: {},
                    });
                }

                changeNav && changeNav("confirm");
            } else if (
                shippingType === "delivery" &&
                !_.isNil(shipping) &&
                !_.isEmpty(_.get(shipping, "coordinates", []))
            ) {
                // mode: driving, bicycling, walking
                for (const merchant of _.values(merchants)) {
                    const source = merchant.coordinates;
                    const destination = _.get(shipping, "coordinates");

                    const subTotalPrice = calculateSubtotalPrice(
                        merchant.items
                    );

                    const tip =
                        Currency(subTotalPrice).multiply(shippingTip).value;

                    const { status, data } = await distance({
                        sources: [source],
                        destinations: [destination],
                        mode: "driving",
                    });

                    const _shipping = {
                        contact: _.pick(shipping, [
                            "first_name",
                            "last_name",
                            "phone",
                            "line1",
                            "line2",
                            "city",
                            "state",
                            "country",
                            "postal_code",
                        ]),
                        source: source,
                        destination: destination,
                        distance: 0,
                        duration: 0,
                        fee: 0,
                        tipRate: shippingTip,
                        tip,
                        note: "",
                    };

                    if (
                        status === "succeeded" &&
                        _.has(data, "distance") &&
                        _.has(data, "duration")
                    ) {
                        _shipping.distance = calculateDeliveryDistance(
                            data.distance
                        );
                        _shipping.duration = calculateDeliveryDuration(
                            data.duration
                        );
                        _shipping.fee = calculateDeliveryFee(data.distance);
                    } else {
                        setError(trans("cantGetDeliveryDistance"));
                        break;
                    }

                    update_merchant({
                        id: merchant.id,
                        shipping: _shipping,
                    });

                    changeNav && changeNav("confirm");
                }
            } else {
                setError(trans("deliveryAddressInvalid"));
            }
        }

        setLoading(false);
    };

    const showModal = (data: any = {}) => {
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
                <Div
                    style={[
                        Style.w_p100,
                        Style.overflow_hidden,
                        Style.p_3,
                        Style.p_b_4,
                    ]}
                >
                    {isLoggedIn ? (
                        <ContactModal
                            setModalRender={_setModalRender}
                            data={data}
                        />
                    ) : (
                        <ContactGuestModal
                            setModalRender={_setModalRender}
                            getContact={(contact: Contact) =>
                                onChange("shipping", contact)
                            }
                        />
                    )}
                </Div>
            ),
        };

        setModelVisible(true);
        _setModalRender(modalRender);
    };

    const changeShippingType = (value: string) => {
        if (
            _.includes(["pickup", "delivery"], value) &&
            !_.isEqual(value, shippingType)
        ) {
            setShippingType(value);

            setCartShippingType(value);
        }
    };

    const changeShipping = (value: object) => {
        if (
            "delivery" === shippingType &&
            !_.isNil(value) &&
            !_.isEmpty(value) &&
            !_.isEqual(value, shipping)
        ) {
            setShipping(value);

            setCartShipping(value);
        }
    };

    const changeShippingTip = (value: number) => {
        if (
            "delivery" === shippingType &&
            !_.isNil(shipping) &&
            !_.isNil(value) &&
            !_.isEqual(value, shippingTip)
        ) {
            setShippingTip(value);

            setCartShippingTip(value);
        }
    };

    const onChange = async (name: string, data: any) => {
        if (name === "shippingType") {
            changeShippingType(data);
        } else if (name === "shipping") {
            changeShipping(data);
        } else if (name === "tip") {
            changeShippingTip(data);
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
            >
                <Div
                    style={[
                        Style.column,
                        Style.row_center,
                        Style.bg_color_15,
                        Style.shadow,
                        Style.border_round_2,
                        Style.p_3,
                        Style.m_b_4,
                    ]}
                >
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_weight_500,
                            Style.m_b_4,
                        ]}
                    >
                        {trans("getOrderTitle")}
                    </Text>
                    <Div style={[Style.column, Style.m_b_2]}>
                        <Div
                            style={[
                                Style.row,
                                Style.row_between,
                                Style.column_center,
                                Style.p_3,
                                Style.border_round_1,
                                Style.b_light_medium,
                                shippingType === "pickup" &&
                                    Style.bg_color_light,
                            ]}
                            onClick={() => onChange("shippingType", "pickup")}
                        >
                            <Div style={[Style.row, Style.column_center]}>
                                <Icon
                                    name="shoppingbag"
                                    size={Style.f_size_20.fontSize}
                                    color={Style.f_color_dark.color}
                                />
                                <Text style={[Style.f_size_14, Style.m_l_2]}>
                                    {trans("shippingType_pickup")}
                                </Text>
                            </Div>
                            <Icon
                                name="chevron-forward"
                                size={Style.f_size_15.fontSize}
                                color={Style.f_color_dark.color}
                            />
                        </Div>

                        <Div
                            style={[
                                Style.column,
                                Style.m_t_2,
                                Style.p_3,
                                Style.border_round_1,
                                Style.b_light_medium,
                                shippingType === "delivery" &&
                                    Style.bg_color_light,
                            ]}
                        >
                            <Div
                                style={[
                                    Style.row,
                                    Style.row_between,
                                    Style.column_center,
                                ]}
                                onClick={() =>
                                    onChange("shippingType", "delivery")
                                }
                            >
                                <Div style={[Style.row, Style.column_center]}>
                                    <Icon
                                        name="car-outline"
                                        size={Style.f_size_20.fontSize}
                                        color={Style.f_color_dark.color}
                                    />
                                    <Text
                                        style={[Style.f_size_14, Style.m_l_2]}
                                    >
                                        {trans("shippingType_delivery")}
                                    </Text>
                                </Div>
                                <Icon
                                    name="chevron-forward"
                                    size={Style.f_size_15.fontSize}
                                    color={Style.f_color_dark.color}
                                />
                            </Div>
                            {shippingType === "delivery" && (
                                <Div style={[Style.column]}>
                                    {isLoggedIn && !_.isEmpty(addresses) ? (
                                        _.map(
                                            addresses,
                                            (
                                                contact: Contact,
                                                index: number
                                            ) => (
                                                <A
                                                    key={index}
                                                    onPress={() =>
                                                        onChange(
                                                            "shipping",
                                                            contact
                                                        )
                                                    }
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
                                                    {_.isEqual(
                                                        _.get(
                                                            shipping,
                                                            "coordinates",
                                                            []
                                                        ),
                                                        _.get(
                                                            contact,
                                                            "coordinates",
                                                            null
                                                        )
                                                    ) ? (
                                                        <Icon
                                                            name="checkmark-circle"
                                                            size={
                                                                Style.f_size_20
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
                                                                Style.f_size_20
                                                                    .fontSize
                                                            }
                                                            color={
                                                                Style
                                                                    .f_color_dark_light
                                                                    .color
                                                            }
                                                        />
                                                    )}
                                                    <Text
                                                        style={[
                                                            Style.flex,
                                                            Style.f_size_13,
                                                            Style.m_l_2,
                                                        ]}
                                                    >
                                                        {`${
                                                            contact.first_name
                                                        } ${
                                                            contact.last_name
                                                        }, ${
                                                            contact.phone
                                                        }, ${Lib.getAddress(
                                                            contact
                                                        )}`}
                                                    </Text>
                                                </A>
                                            )
                                        )
                                    ) : !_.isNil(shipping) &&
                                      !_.isEmpty(shipping) ? (
                                        <A
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
                                                name="checkmark-circle"
                                                size={Style.f_size_20.fontSize}
                                                color={
                                                    Style.f_color_success.color
                                                }
                                            />
                                            <Text
                                                style={[
                                                    Style.flex,
                                                    Style.f_size_13,
                                                    Style.m_l_2,
                                                ]}
                                            >
                                                {`${_.get(
                                                    shipping,
                                                    "first_name",
                                                    ""
                                                )} ${_.get(
                                                    shipping,
                                                    "last_name",
                                                    ""
                                                )}, ${_.get(
                                                    shipping,
                                                    "phone",
                                                    ""
                                                )}, ${Lib.getAddress(
                                                    shipping
                                                )}`}
                                            </Text>
                                        </A>
                                    ) : null}
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
                                            {trans("addDeliveryAddress")}
                                        </Text>
                                    </A>
                                </Div>
                            )}
                        </Div>
                    </Div>
                </Div>

                {shippingType === "delivery" &&
                    !_.isNil(shipping) &&
                    !_.isEmpty(shipping) &&
                    !_.isEmpty(_.get(tipModel, "data", {})) && (
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
                                    Style.column,
                                    Style.row_center,
                                    Style.column_start,
                                    Style.m_b_2,
                                ]}
                            >
                                <Text
                                    style={[
                                        Style.f_size_15,
                                        Style.f_weight_500,
                                    ]}
                                >
                                    {trans("deliveryTip")}
                                    <Text
                                        style={[Style.f_size_13, Style.m_l_1]}
                                    >
                                        {`( ${symbol}${Currency(subtotalPrice)
                                            .multiply(shippingTip)
                                            .value.toFixed(2)} )`}
                                    </Text>
                                </Text>
                                <Text
                                    style={[
                                        Style.f_size_12,
                                        Style.f_color_dark,
                                        Style.m_t_2,
                                    ]}
                                >
                                    {trans("tipNotice")}
                                </Text>
                            </Div>
                            <Tip
                                items={tipModel.data}
                                value={shippingTip}
                                onChange={(tip: number) => onChange("tip", tip)}
                            />
                        </Div>
                    )}

                {error !== "" && (
                    <Div
                        style={[
                            Style.row,
                            Style.row_start,
                            Style.column_center,
                            Style.p_2,
                        ]}
                    >
                        <Text style={[Style.f_color_danger, Style.f_size_13]}>
                            {error}
                        </Text>
                    </Div>
                )}

                <Div style={[Style.column]}>
                    <Modal
                        transparent={false}
                        visible={modelVisible}
                        {...modalRender}
                    />
                </Div>
            </Scroll>

            <Div
                style={[
                    Style.bottom_horizontal,
                    Style.bg_color_15,
                    Style.shadow_top,
                ]}
            >
                <Button
                    size="fullwidth"
                    trans="continue"
                    onPress={handleSubmit}
                    disabled={!valid || loading}
                    loading={loading}
                    style={[
                        Style.m_v_2,
                        Style.p_v_3,
                        { width: WINDOW_WIDTH - 20 },
                    ]}
                />
            </Div>
        </>
    );
};

const mapStateToProps = (state: any) => {
    return {
        profile: state.profile,
        region: state.region,
        cart: state.cart,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        update_merchant: (data: any) => dispatch(updateMerchantRequest(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutOrder);
