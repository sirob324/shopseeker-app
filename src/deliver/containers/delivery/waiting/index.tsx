import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import TrackPlayer from "react-native-track-player";

import { io } from "socket.io-client";

import Config from "config";
import { FOOTER_BAR_HEIGHT } from "config/constant";

import { deliveryForPickup } from "deliver/request";

import Lib from "helpers/lib";
import { getToken } from "helpers/profile";

import Div from "components/div";
import Loading from "components/loading";
import NoResultFound from "components/no-result";
import ErrorMessage from "components/error-message";

import { trans } from "locales";

import Style from "style";

import DeliveryList from "./list";

type Props = {
    [key: string]: any;
};

type State = {
    loading: boolean;
    deliveries: any[];
    error: string;
    location: number[];
};

class WaitingDelivery extends Component<Props, State> {
    state = {
        loading: true,
        deliveries: [],
        error: "",
        location: [],
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

        this.getLocation();
    }

    componentDidUpdate(prevProps, prevState) {
        const { location } = this.state;

        if (!_.isEmpty(location) && !_.isEqual(prevState.location, location)) {
            this.fetchData();
        }
    }

    getLocation = async () => {
        try {
            const position: any = await Lib.getCurrentPosition();

            if (position) {
                this.setState(
                    {
                        location: [
                            position.coords.longitude,
                            position.coords.latitude,
                        ],
                    },
                    async () => {
                        const token = await getToken();

                        let options = {
                            path: "/api/v3/",
                            withCredentials: true,
                        };

                        if (token) {
                            _.set(options, "query.token", token);
                        }

                        const socket = io(Config.HOST, options);

                        socket.on("picked_delivery", this.pickedDelivery);

                        socket.on("add_delivery", this.addDelivery);

                        this.socket = socket;
                    }
                );
            } else {
                this.setState({
                    error: trans("getLocationFailed"),
                    loading: false,
                });
            }
        } catch (e) {
            this.setState({
                error: trans("getLocationFailed"),
                loading: false,
            });
        }
    };

    fetchData = async () => {
        const { location } = this.state;

        try {
            const { status, data } = await deliveryForPickup({
                condition: {
                    status: "waiting",
                    createdAt: moment.utc().subtract(60, "days").toISOString(),
                },
                location,
                distance: 100000,
                key: "source",
            });

            if (status === "succeeded" && !_.isEmpty(data)) {
                this.setState({
                    deliveries: data,
                    loading: false,
                });
            } else {
                this.setState({ loading: false });
            }
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    addDelivery = (message: any) => {
        const { deliveries } = this.state;

        const data = JSON.parse(message);

        if (!_.isEmpty(data)) {
            const { type, payload } = data;

            if (
                type === "add" &&
                _.findIndex(deliveries, ["id", payload.id]) === -1
            ) {
                Lib.showToast(trans("haveNewDelivery"), {
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
                        deliveries: _.concat(deliveries, payload),
                    },
                    () => TrackPlayer.stop()
                );
            }
        }
    };

    pickedDelivery = (message: any) => {
        const { deliveries } = this.state;

        const data = JSON.parse(message);

        if (!_.isEmpty(data)) {
            const { type, payload } = data;

            if (
                type === "remove" &&
                _.findIndex(deliveries, ["id", payload.id]) > -1
            ) {
                this.setState({
                    deliveries: _.filter(
                        deliveries,
                        (delivery: any) => delivery.id !== payload.id
                    ),
                });
            }
        }
    };

    handleClick = (data: object) => {
        this.socket.emit("picked_delivery", data);
    };

    displayList = () => {
        const { deliver } = this.props;
        const { loading, deliveries, error, location } = this.state;

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

        if (_.isEmpty(deliveries)) {
            return (
                <Div style={[Style.v_center, Style.h_p100]}>
                    <NoResultFound />
                </Div>
            );
        }

        const groupByMerchant = _.reduce(
            deliveries,
            (res: any, value: any) => {
                if (
                    _.has(value, "merchant.id") &&
                    _.get(value, "merchant.id")
                ) {
                    const merchant = _.get(value, "merchant");
                    const delivery = _.omit(value, "merchant");

                    if (_.has(res, merchant.id)) {
                        res[merchant.id]["deliveries"].push(delivery);
                    } else {
                        _.set(res, merchant.id, {
                            ...merchant,
                            deliveries: [delivery],
                        });
                    }
                }

                return res;
            },
            {}
        );

        return _.map(
            _.orderBy(_.values(groupByMerchant), ["distance"], ["asc"]),
            (value: any[], index: number) => {
                return (
                    <DeliveryList
                        key={index}
                        currentLocation={location}
                        merchant={_.omit(value, "deliveries")}
                        deliver={deliver}
                        deliveries={_.get(value, "deliveries")}
                        onClick={this.handleClick}
                    />
                );
            }
        );
    };

    render() {
        return (
            <Div style={{ paddingBottom: FOOTER_BAR_HEIGHT }}>
                {this.displayList()}
            </Div>
        );
    }
}

export default WaitingDelivery;
