import React, { useState } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Modal from "components/modal";
import Scroll from "components/scroll";

import ContactCard from "components/contact-card";
import PaymentCard from "components/payment-card";

import CardModal from "containers/checkout/card";
import ContactModal from "containers/checkout/contact";

import { trans } from "locales";

import Style from "style";

import { redirectToShop } from "utils/navigation";

import { Contact, Card } from "interfaces/profile";

import { signout as signoutAction } from "actions/auth";

import Lib from "helpers/lib";

import { deleteCard } from "request/card";
import { deleteContactAddress } from "request/address";

import {
    removeCard,
    removeAddress,
    setDefaultCard,
    setDefaultAddress,
} from "actions/profile";

const ProfilePage = (props: any) => {
    const {
        remove_address,
        remove_card,
        signout,
        shop,
        profile: { account, addresses, cards },
    } = props;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalRender, setModalRender] = useState<
        any & { hideModal?: boolean }
    >({});
    const _setModalRender = (_modalRender: any) => {
        setModalRender(_modalRender);

        if (_.get(_modalRender, "hideModal") === true) {
            setModalVisible(false);
        }
    };

    const showModal = (name: string, data: any = {}) => {
        let _modalRender = {};

        if (name === "contact") {
            _modalRender = {
                renderHeader: () => (
                    <Div style={[Style.w_p100, Style.row, Style.column_center]}>
                        <A
                            onPress={() => {
                                setModalVisible(false);
                                _setModalRender({});
                            }}
                        >
                            <Text style={[Style.f_size_13]}>
                                {trans("cancel")}
                            </Text>
                        </A>
                    </Div>
                ),
                renderContent: () => (
                    <Div style={[Style.w_p100, Style.p_3, Style.p_b_4]}>
                        <ContactModal
                            setModalRender={_setModalRender}
                            data={data}
                        />
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
        } else if (name === "payment") {
            _modalRender = {
                renderHeader: () => (
                    <Div style={[Style.w_p100, Style.row, Style.column_center]}>
                        <A
                            onPress={() => {
                                setModalVisible(false);
                                _setModalRender({});
                            }}
                        >
                            <Text style={[Style.f_size_13]}>
                                {trans("cancel")}
                            </Text>
                        </A>
                    </Div>
                ),
                renderContent: () => (
                    <Div style={[Style.w_p100]}>
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
        }

        setModalVisible(true);
        _setModalRender(_modalRender);
    };

    const onDelete = async (name: string, data: any) => {
        switch (name) {
            case "contact":
                const res = await deleteContactAddress({
                    accountId: account.id,
                    id: data.id,
                });

                if (res.status === "succeeded") {
                    remove_address(data);

                    Lib.showToast(trans("succeeded"));
                } else if (_.has(res, "error.message")) {
                    Lib.showToast(_.get(res, "error.message"));
                } else {
                    Lib.showToast(trans("failed"));
                }
                break;

            case "payment":
                const res2 = await deleteCard({
                    accountId: account.id,
                    id: data.id,
                });

                if (res2.status === "succeeded") {
                    remove_card(data);

                    Lib.showToast(trans("succeeded"));
                } else if (_.has(res2, "error.message")) {
                    Lib.showToast(_.get(res2, "error.message"));
                } else {
                    Lib.showToast(trans("failed"));
                }
                break;

            default:
                return false;
        }
    };

    return (
        <Scroll
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            contentContainerStyle={[Style.bg_color_15, Style.p_2]}
        >
            <Div
                style={[
                    Style.column,
                    Style.bg_color_15,
                    Style.shadow,
                    Style.border_round_2,
                    Style.m_t_2,
                    Style.p_3,
                ]}
            >
                <Div style={[Style.row, Style.column_center, Style.m_b_2]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_weight_500,
                            Style.m_r_2,
                        ]}
                    >
                        {trans("deliveryAddress")}
                    </Text>
                    <A onPress={() => showModal("contact")}>
                        <Icon
                            name="add-circle-outline"
                            size={Style.f_size_25.fontSize}
                            color={Style.f_color_dark.color}
                        />
                    </A>
                </Div>
                {_.map(addresses, (item: Contact, index: number) => (
                    <Div
                        key={index}
                        style={[
                            Style.bg_color_light,
                            Style.b_b_light_medium,
                            Style.p_2,
                        ]}
                    >
                        <ContactCard
                            hasEdit={true}
                            hasDelete={true}
                            onEdit={() => showModal("contact", item)}
                            onDelete={() => onDelete("contact", item)}
                            item={item}
                        />
                    </Div>
                ))}
            </Div>

            <Div
                style={[
                    Style.column,
                    Style.bg_color_15,
                    Style.shadow,
                    Style.border_round_2,
                    Style.m_t_4,
                    Style.p_3,
                ]}
            >
                <Div style={[Style.row, Style.column_center, Style.m_b_2]}>
                    <Text
                        style={[
                            Style.f_size_15,
                            Style.f_weight_500,
                            Style.m_r_2,
                        ]}
                    >
                        {trans("orderPayment")}
                    </Text>
                    <A onPress={() => showModal("payment")}>
                        <Icon
                            name="add-circle-outline"
                            size={Style.f_size_25.fontSize}
                            color={Style.f_color_dark.color}
                        />
                    </A>
                </Div>
                {_.map(cards, (item: Card, index: number) => (
                    <Div
                        key={index}
                        style={[
                            Style.bg_color_light,
                            Style.b_b_light_medium,
                            Style.p_2,
                        ]}
                    >
                        <PaymentCard
                            key={index}
                            onDelete={() => onDelete("payment", item)}
                            item={item}
                        />
                    </Div>
                ))}
            </Div>

            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.b_b_light_medium,
                    Style.p_2,
                    Style.m_t_2,
                ]}
            >
                <A
                    onPress={() =>
                        signout({
                            success: () =>
                                redirectToShop({
                                    id: shop.id,
                                    tab: "home",
                                }),
                        })
                    }
                >
                    <Text>{trans("navlinkLogout")}</Text>
                </A>
                <Icon
                    name="chevron-forward"
                    size={10}
                    color={Style.f_color_dark.color}
                />
            </Div>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                presentationStyle="overFullScreen"
                onDismiss={() => setModalVisible(false)}
                {...modalRender}
            />
        </Scroll>
    );
};

const mapStateToProps = (state: any) => {
    return {
        profile: state.profile,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        remove_address: (data: any) => dispatch(removeAddress(data)),
        set_default_address: (data: any) => dispatch(setDefaultAddress(data)),
        remove_card: (data: any) => dispatch(removeCard(data)),
        set_default_card: (data: any) => dispatch(setDefaultCard(data)),
        signout: (callback: any) => dispatch(signoutAction(callback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
