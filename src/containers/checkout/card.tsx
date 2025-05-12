import React, { FC, useState } from "react";
import _ from "lodash";
import { connect } from "react-redux";

// import stripe, { PaymentCardTextField as CardElement } from "tipsi-stripe";
import {
    CardField,
    CardFieldInput,
    useStripe,
    ConfirmSetupIntentResult,
} from "@stripe/stripe-react-native";

import Config from "config";

import { addCard as addCardAction } from "actions/profile";

import { addNewCard } from "request/card";
import { createCustomer } from "request/account";

import Lib from "helpers/lib";

import Div from "components/div";
import Text from "components/text";
import Input from "components/input";
import Button from "components/button";

import { trans } from "locales";

import Style from "style";

// stripe.setOptions({
//     publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
// });

type Props = {
    [key: string]: any;
};

const CardModal: FC<Props> = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [holderName, setHolderName] = useState<string>("");
    const [card, setCard] = useState<CardFieldInput.Details | null>(null);
    const [payment, setPayment] = useState<{ status: string }>({
        status: "initial",
    });
    const [message, setMessage] = useState<string>("");

    const { account, addCard, setModalRender } = props;

    const { confirmSetupIntent } = useStripe();

    const handleSubmit = async () => {
        if (!!!holderName) {
            setMessage("Cardholder is empty");

            return;
        }

        if (!card?.complete) {
            setMessage("Card is invalid");

            return;
        }

        setLoading(true);

        const { status, data } = await createCustomer({
            accountId: account.id,
            paymentProvider: Config.PAYMENT_PROVIDER,
        });

        if (status === "failed") {
            setPayment({ status: "error" });
            setMessage(trans("failed"));
            setLoading(false);
            return;
        }

        try {
            const cardSetup: ConfirmSetupIntentResult =
                await confirmSetupIntent(data.client_secret, {
                    type: "Card",
                    billingDetails: {
                        name: holderName,
                    },
                });

            if (_.get(cardSetup, "error") === undefined) {
                const { status: _status, data: _data } = await addNewCard({
                    accountId: account.id,
                    paymentProvider: Config.PAYMENT_PROVIDER,
                    paymentMethodId: cardSetup.setupIntent!.paymentMethodId,
                });

                if (_status === "failed") {
                    setPayment({ status: "error" });
                    setMessage(trans("failed"));
                    setLoading(false);
                } else {
                    setLoading(false);
                    setPayment({ status: "success" });
                    setModalRender({ hideModal: true });
                    addCard(_data);
                    Lib.showToast(trans("succeeded"));
                }
            } else {
                setPayment({ status: "error" });
                setMessage(_.get(cardSetup, "error.message"));
                setLoading(false);
                return;
            }
        } catch (error) {
            setPayment({ status: "error" });
            setMessage(_.get(error, "message"));
            setLoading(false);
        }
    };

    return (
        <Div style={[Style.column, Style.p_2]}>
            {message !== "" && (
                <Div
                    style={[
                        Style.w_p100,
                        Style.row,
                        Style.column_center,
                        Style.row_start,
                        Style.p_2,
                        Style.bg_color_13,
                    ]}
                >
                    <Text style={[Style.f_size_13]}>{message}</Text>
                </Div>
            )}

            <Input
                value={holderName}
                placeholder={trans("cardHolder")}
                onChange={(value: string) => setHolderName(value)}
                style={[
                    Style.row,
                    Style.bg_color_15,
                    Style.shadow,
                    Style.border_round_2,
                    Style.p_1,
                    Style.m_b_2,
                ]}
            />

            <Div
                style={[
                    Style.w_p100,
                    Style.bg_color_15,
                    Style.shadow,
                    Style.border_round_1,
                ]}
            >
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
                    onCardChange={(cardDetails) => {
                        setCard(cardDetails);
                    }}
                />
            </Div>

            {payment.status !== "success" && (
                <Button
                    size="fullwidth"
                    trans="save"
                    loading={loading}
                    disabled={_.isEmpty(card) || holderName === ""}
                    onPress={handleSubmit}
                    style={[Style.m_t_4]}
                />
            )}
        </Div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        account: state.profile.account,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addCard: (data: any) => dispatch(addCardAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardModal);
