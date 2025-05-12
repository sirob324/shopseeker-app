import React, { Component, FC, useState } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import Currency from "currency.js";
import { io } from "socket.io-client";
import TrackPlayer from "react-native-track-player";

import Div from "components/div";
import Text from "components/text";
import Button from "components/button";
import Scroll from "components/scroll";
import Loading from "components/loading";
import NoResultFound from "components/no-result";
import ErrorMessage from "components/error-message";

import { trans } from "locales";

import Style from "style";

import Config from "config";

import CurrencyModel from "model/currency";

import { Order } from "interfaces/cart";

import Lib from "helpers/lib";
import { getToken } from "helpers/profile";

import { redirectToOrderDetail } from "utils/navigation";

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

import { orderForPick, updateOrderStatus } from "merchant/request";

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
                        title={trans("startPicking")}
                        onPress={() =>
                            op({
                                order: item.id,
                                merchant: merchant.id,
                                status: "picking",
                            })
                        }
                        style={[Style.bg_color_success, Style.p_1]}
                    />
                </Div>

                {/* <Icon
                    name="chevron-forward"
                    size={Style.f_size_15.fontSize}
                    color={Style.f_color_dark_light.color}
                /> */}
            </Div>
        </Div>
    );
};

type State = {
    loading: boolean;
    orders: any[];
    error: string;
};

class ReadyToPickOrder extends Component<Props, State> {
    state = {
        loading: true,
        orders: [],
        error: "",
    };

    socket: any = null;

    componentDidMount() {
        const track1 = {
            id: "neworder",
            url: require("assets/audio/neworder.mp3"),
            title: "New Order",
            artist: "shopseeker",
        };

        TrackPlayer.setupPlayer();

        TrackPlayer.add(track1);

        this.init();

        this.fetchData();
    }

    init = async () => {
        try {
            const token = await getToken();

            let options = {
                path: "/api/v3/",
                withCredentials: true,
            };

            if (token) {
                _.set(options, "query.token", token);
            }

            const socket = io(Config.HOST, options);

            socket.on("pick_order", this.pickOrder);

            socket.on("add_order", this.addOrder);

            this.socket = socket;
        } catch (e) {
            this.setState({
                error: trans("failed"),
                loading: false,
            });
        }
    };

    fetchData = async () => {
        const { merchant } = this.props;

        try {
            const { status, data } = await orderForPick({
                merchantId: merchant.id,
            });

            if (status === "succeeded" && !_.isEmpty(data)) {
                this.setState({
                    orders: data,
                    loading: false,
                });
            } else {
                this.setState({ loading: false });
            }
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    addOrder = (message: any) => {
        const { merchant } = this.props;
        const { orders } = this.state;

        const data = JSON.parse(message);

        if (
            !_.isEmpty(data) &&
            _.has(data, "merchantId") &&
            _.get(data, "merchantId") === merchant.id
        ) {
            const { type, payload } = data;

            if (
                type === "add" &&
                _.findIndex(orders, ["id", payload.id]) === -1
            ) {
                Lib.showToast(trans("haveNewOrder"), {
                    style: {
                        ...Style.bg_color_success,
                    },
                    textStyle: {
                        ...Style.f_color_15,
                    },
                });

                TrackPlayer.play();

                this.setState(
                    {
                        orders: _.concat(orders, payload),
                    },
                    () => TrackPlayer.stop()
                );
            }
        }
    };

    pickOrder = (message: any) => {
        const { orders } = this.state;

        const data = JSON.parse(message);

        if (!_.isEmpty(data)) {
            const { type, payload } = data;

            if (
                type === "remove" &&
                _.findIndex(orders, ["id", payload.id]) > -1
            ) {
                this.setState({
                    orders: _.filter(
                        orders,
                        (order: any) => order.id !== payload.id
                    ),
                });
            }
        }
    };

    handleClick = (data: object) => {
        this.socket.emit("pick_order", data);
    };

    displayList = () => {
        const { merchant } = this.props;

        const { loading, error, orders } = this.state;

        if (loading) {
            return (
                <Div style={[Style.v_center, Style.p_4]}>
                    <Loading />
                </Div>
            );
        }

        if (error) {
            return (
                <Div style={[Style.v_center, Style.p_2]}>
                    <ErrorMessage message={error} />
                </Div>
            );
        }

        if (_.isEmpty(orders)) {
            return (
                <Div style={[Style.v_center, Style.h_p100]}>
                    <NoResultFound />
                </Div>
            );
        }

        return (
            <Div style={[Style.column]}>
                {_.map(orders, (order: Order, index: number) => (
                    <OrderItem
                        key={index}
                        item={order}
                        merchant={merchant}
                        callback={this.handleClick}
                    />
                ))}
            </Div>
        );
    };

    render() {
        return <Scroll>{this.displayList()}</Scroll>;
    }
}

export default ReadyToPickOrder;
