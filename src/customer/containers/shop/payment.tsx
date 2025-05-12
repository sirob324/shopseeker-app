import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { clearCart as clearCartAction } from "actions/cart";

import { getPayment } from "request/payment";

import Lib from "helpers/lib";

import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Loading from "components/loading";
import ErrorMessage from "components/error-message";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const PaymentPage: FC<Props> = (props) => {
    const { pii, pay, clearCart, callback } = props;

    const [loading, changeLoading] = useState<boolean>(true);
    const [paymentStatus, setPaymentStatus] = useState<string>("");
    const [OrderSerials, setOrderSerials] = useState<[]>([]);

    if (!pay) {
        return <ErrorMessage message={trans("cantGetPaymentInformation")} />;
    }

    const requestData = () => {
        let times = 0;
        const interval = setInterval(async () => {
            const { status, data, orderSerials } = await getPayment({
                pii,
                id: pay,
            });

            if (status === "succeeded") {
                if (!_.isNil(orderSerials) && !_.isEmpty(orderSerials)) {
                    setOrderSerials(orderSerials);
                }

                if (data === "succeeded") {
                    clearCart();

                    changeLoading(false);
                    setPaymentStatus("succeeded");

                    clearInterval(interval);
                } else {
                    if (times >= 5) {
                        changeLoading(false);
                        setPaymentStatus("failed");

                        clearInterval(interval);
                    }
                }
            }

            times++;

            if (times >= 5) {
                changeLoading(false);
                setPaymentStatus("failed");

                clearInterval(interval);
            }
        }, 2000);
    };

    useEffect(() => {
        requestData();
    }, []);

    return (
        <Div style={[Style.v_center, Style.h_p100]}>
            {loading ? (
                <Loading />
            ) : (
                <Div style={[Style.v_center, Style.p_3]}>
                    {paymentStatus === "succeeded" ? (
                        <Div style={[Style.v_center]}>
                            <Icon
                                name="checkmark-circle"
                                size={80}
                                color={Style.f_color_success.color}
                            />
                            <Text style={[Style.f_size_13, Style.m_t_2]}>
                                {trans("paymentSucceeded")}
                            </Text>
                        </Div>
                    ) : (
                        <Div style={[Style.v_center]}>
                            <Icon
                                name="close-circle"
                                size={80}
                                color={Style.f_color_danger.color}
                            />
                            <Text style={[Style.f_size_13, Style.m_t_2]}>
                                {trans("paymentFailed")}
                            </Text>
                        </Div>
                    )}
                    {!_.isEmpty(OrderSerials) && (
                        <Div
                            style={[
                                Style.column,
                                Style.row_center,
                                Style.bg_color_light,
                                Style.p_3,
                                Style.m_t_4,
                                Style.border_round_2,
                            ]}
                        >
                            {_.map(
                                OrderSerials,
                                (OrderSerial: string, index: number) => (
                                    <Div
                                        key={index}
                                        style={[Style.h_center, Style.p_1]}
                                    >
                                        <Text
                                            style={[Style.f_size_13]}
                                        >{`${trans("orderSerial")}${
                                            _.size(OrderSerials) > 1
                                                ? " " + _.toInteger(index + 1)
                                                : ""
                                        }:`}</Text>
                                        <Text
                                            style={[
                                                Style.f_size_13,
                                                Style.f_weight_500,
                                                Style.m_l_1,
                                            ]}
                                        >{`#${Lib.chunkStr(
                                            OrderSerial,
                                            4
                                        )}`}</Text>
                                    </Div>
                                )
                            )}
                            <Div style={[Style.h_center]}>
                                <Text
                                    style={[
                                        Style.f_size_11,
                                        Style.f_color_primary,
                                    ]}
                                >
                                    {trans("guestForCheckoutNotice")}
                                </Text>
                            </Div>
                        </Div>
                    )}
                    <Div
                        style={[Style.h_center, Style.m_t_4]}
                        onClick={callback}
                    >
                        <Text style={[Style.f_size_15, Style.underline]}>
                            {trans("back")}
                        </Text>
                    </Div>
                </Div>
            )}
        </Div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        clearCart: () => dispatch(clearCartAction()),
    };
};

export default connect(null, mapDispatchToProps)(PaymentPage);
