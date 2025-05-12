import React, { useState, FC } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import Currency from "currency.js";

import CurrencyModel from "model/currency";

import Div from "components/div";
import Text from "components/text";
import Button from "components/button";
import GraphqlFlatList from "components/flat-list/graphql";

import { trans } from "locales";

import Style from "style";

import Lib from "helpers/lib";

import { redirectToOrderDetail } from "utils/navigation";

import { useMerchant } from "merchant/contexts/app";

import { updateOrderStatus } from "merchant/request";

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
    [key: string]: any;
};

const OrderItem: FC<Props> = ({ merchant, item, callback }) => {
    const { serial, createdAt, currency, subtotal, totalTax, discount, items } =
        item;

    const symbol = _.get(CurrencyModel, `code.${_.toUpper(currency)}.symbol`);

    const total = Currency(subtotal).add(totalTax).subtract(discount).value;

    const timezone = _.get(merchant, "region.timezone", "America/Montreal");

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const op = async (data: object) => {
        setLoading(true);
        setDisabled(true);

        const res = await updateOrderStatus(data);

        let message = "";
        let status = "";

        if (_.get(res, "status") === "succeeded") {
            message = trans("succeeded");
            status = "succeeded";
        } else if (_.get(res, "status") === "failed") {
            message = trans(_.get(res, "data") ? res.data : "failed");
            status = "failed";
        } else if (_.get(res, "status") === "error") {
            message = res.message;
            status = "error";
        }

        let style = {
            ...Style.row,
            ...Style.column_center,
            ...Style.border_round_3,
            ...Style.p_v_2,
            ...Style.p_h_3,
        };

        let textStyle = {};

        if (status === "succeeded") {
            style = {
                ...style,
                ...Style.bg_color_success,
            };

            textStyle = {
                ...Style.f_color_15,
            };
        }

        if (status === "failed") {
            style = {
                ...style,
                ...Style.bg_color_warning,
            };
        }

        if (status === "danger") {
            style = {
                ...style,
                ...Style.bg_color_danger,
            };

            textStyle = {
                ...Style.f_color_15,
            };
        }

        Lib.showToast(message, {
            shadowColor: Style.bg_color_gray.backgroundColor,
            style,
            textStyle,
            onClose:
                status === "succeeded"
                    ? () => {
                          callback({
                              type: "remove",
                              payload: {
                                  id: item.id,
                              },
                          });
                      }
                    : undefined,
        });

        setDisabled(false);
        setLoading(false);
    };

    return (
        <Div
            style={[Style.column, Style.p_v_3, Style.b_b_light_medium]}
            onPress={() => redirectToOrderDetail(item)}
        >
            <Div style={[Style.row, Style.row_between, Style.column_center]}>
                <Text
                    style={[Style.f_size_13, Style.f_weight_500]}
                >{`#${Lib.chunkStr(serial, 4)}`}</Text>
                <Text style={[Style.f_size_13]}>
                    {dayjs(createdAt).tz(timezone).format("YYYY-MM-DD HH:mm")}
                </Text>
            </Div>

            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.w_p100,
                    Style.m_t_2,
                ]}
            >
                <Text style={[Style.f_size_13, Style.f_color_dark]}>
                    {`${symbol}${total}  /  `}
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {trans("collectItems", {
                            quantity: _.size(items),
                            unit: trans(_.size(items) > 1 ? "items" : "item"),
                        })}
                    </Text>
                </Text>

                <Div style={[Style.column, Style.row_center, Style.p_l_8]}>
                    <Button
                        size="small"
                        disabled={disabled}
                        loading={loading}
                        title={trans("stopPicking")}
                        onPress={() =>
                            op({
                                order: item.id,
                                merchant: merchant.id,
                                status: "ready_to_pick_up",
                            })
                        }
                        style={[Style.bg_color_success, Style.p_1]}
                    />
                </Div>
            </Div>
        </Div>
    );
};

const PickingOrderPage = () => {
    const { merchant } = useMerchant();

    const [sort] = useState("createdAt:desc");
    const [newItem, setNewItem] = useState(null);

    const where: { [key: string]: any } = {
        merchant: merchant.id,
        payment_null: false,
        status: "picking",
        paymentStatus: "succeeded",
    };

    const callback = (item: any) => {
        setNewItem(item);
    };

    return (
        <Div style={[Style.column, Style.row_center, Style.h_p100]}>
            <GraphqlFlatList
                select={[
                    "id",
                    "serial",
                    "currency",
                    "subtotal",
                    "totalTax",
                    "discount",
                    "items",
                    "createdAt",
                    "shippingType",
                    "paymentStatus",
                ]}
                from="moreOrders"
                where={where}
                order={sort}
                latest="createdAt_gt"
                renderItem={(item: any) => {
                    return (
                        <OrderItem
                            item={item}
                            merchant={merchant}
                            callback={callback}
                        />
                    );
                }}
                itemType="merchant_picking_orders"
                stickyHeaderIndices={[0]}
                newItem={newItem}
            />
        </Div>
    );
};

export default PickingOrderPage;
