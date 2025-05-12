import React, { FC } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";

import Div from "components/div";
import Text from "components/text";
import Image from "components/image";
import NoResultFound from "components/no-result";

import MerchantCartItem from "containers/cart/item";
import MerchantCartPrice from "containers/cart/price";
import MerchantCartDelivery from "containers/cart/delivery";

import { CartItem, Merchant } from "interfaces/cart";

import { redirectToShop } from "utils/navigation";

import { trans } from "locales";

import Style from "style";

type Props = {
    canEdit?: boolean;
    showDelivery?: boolean;
    showMerchants?: [];
    [key: string]: any;
};

const CartMerchant: FC<Props> = ({
    canEdit = true,
    showDelivery = false,
    showMerchants = [],
}) => {
    const merchants = useSelector((state: any) => state["cart"]["merchants"]);

    const _merchants = _.isEmpty(showMerchants)
        ? merchants
        : _.filter(merchants, (merchant: Merchant) =>
              _.includes(showMerchants, _.get(merchant, "id", ""))
          );

    return (
        <Div style={[Style.column, Style.bg_color_15]}>
            {_.isEmpty(_merchants) ? (
                <Div style={[Style.v_center, Style.h_p100]}>
                    <NoResultFound />
                </Div>
            ) : (
                _.map(_merchants, (merchant: Merchant, index: number) => (
                    <Div key={index} style={[Style.column, Style.bg_color_15]}>
                        <Div
                            style={[
                                Style.column,
                                Style.bg_color_light,
                                Style.p_3,
                            ]}
                        >
                            <Div
                                style={[
                                    Style.row,
                                    Style.row_between,
                                    Style.column_center,
                                    Style.w_p100,
                                ]}
                            >
                                <Div
                                    onClick={() =>
                                        redirectToShop({ id: merchant.id })
                                    }
                                    style={[Style.row, Style.column_center]}
                                >
                                    {_.has(merchant, "logo") && (
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
                                            <Image src={merchant.logo.url} />
                                        </Div>
                                    )}
                                    {_.has(merchant, "name") && (
                                        <Div style={[Style.m_l_2]}>
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
                                <Div
                                    style={[
                                        Style.h_center,
                                        Style.bg_color_light_medium,
                                        Style.p_h_2,
                                        Style.p_v_1,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_500,
                                        ]}
                                    >
                                        {`${trans("orderTitle")} #${index + 1}`}
                                    </Text>
                                </Div>
                            </Div>
                            {showDelivery && (
                                <MerchantCartDelivery merchant={merchant} />
                            )}
                        </Div>
                        <Div style={[Style.column]}>
                            {!_.isEmpty(merchant.items) &&
                                _.map(
                                    merchant.items,
                                    (item: CartItem, index: number) => (
                                        <MerchantCartItem
                                            key={index}
                                            canEdit={canEdit}
                                            item={item}
                                            currency={
                                                merchant["region"]["currency"]
                                            }
                                        />
                                    )
                                )}
                        </Div>
                        <Div style={[Style.column]}>
                            {!_.isEmpty(merchant.items) && (
                                <MerchantCartPrice
                                    merchant={merchant}
                                    currency={merchant["region"]["currency"]}
                                />
                            )}
                        </Div>
                    </Div>
                ))
            )}
        </Div>
    );
};

export default CartMerchant;
