import React, { FC } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Image from "components/image";
import { canOpen, open } from "components/linking";

import Lib from "helpers/lib";

import { trans } from "locales";

import Style from "style";

import DeliveryItem from "./item";

type Props = {
    [key: string]: any;
};

const WaitingList: FC<Props> = (props) => {
    const { currentLocation, merchant, deliver, deliveries, onClick } = props;

    let from = [currentLocation[1], currentLocation[0]];
    let to = [merchant.coordinates[1], merchant.coordinates[0]];

    const { googleWeb, googleApp, appleMap } = Lib.getDirection(from, to);

    const openGoogle = async () => {
        const isOpened = await canOpen(googleApp);

        if (isOpened) {
            open(googleApp);
        } else {
            open(googleWeb);
        }
    };

    return (
        <Div style={[Style.bg_color_15, Style.p_1]}>
            <Div
                style={[
                    Style.row,
                    Style.row_between,
                    Style.column_center,
                    Style.p_1,
                    Style.bg_color_light,
                ]}
            >
                <Div style={[Style.row, Style.column_center, Style.w_p60]}>
                    <Div
                        style={[
                            Style.b_light_medium,
                            Style.overflow_hidden,
                            Style.m_r_2,
                            {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                            },
                        ]}
                    >
                        <Image src={merchant.logo} />
                    </Div>
                    <Div
                        style={[
                            Style.column,
                            Style.row_center,
                            Style.column_start,
                        ]}
                    >
                        <Text style={[Style.f_size_13, Style.f_weight_500]}>
                            {merchant.name}
                        </Text>
                        <Div style={[Style.row, Style.column_center]}>
                            <Icon
                                name="location"
                                size={Style.f_size_17.fontSize}
                                color={Style.f_color_first.color}
                            />
                            <Text
                                style={[
                                    Style.f_size_11,
                                    Style.f_color_dark,
                                    Style.m_l_1,
                                ]}
                            >
                                {(merchant.distance / 1000).toFixed(1)}{" "}
                                {trans("mileage_km")}
                            </Text>
                        </Div>
                    </Div>
                </Div>
                <Div style={[Style.row, Style.column_center]}>
                    <Div style={[Style.m_r_1, { width: 30, height: 30 }]}>
                        <A onPress={() => open(appleMap)}>
                            <Image
                                source={require("assets/icon/apple-map.png")}
                                style={{ width: 25, height: 25 }}
                            />
                        </A>
                    </Div>
                    <Div style={[Style.m_r_1, { width: 30, height: 30 }]}>
                        <A onPress={openGoogle}>
                            <Image
                                source={require("assets/icon/google-map.png")}
                                style={{ width: 25, height: 25 }}
                            />
                        </A>
                    </Div>
                </Div>
                <Div style={[Style.row, Style.row_center]}>
                    <Div
                        style={[
                            { width: 24, height: 24, borderRadius: 12 },
                            Style.row_center,
                            Style.m_r_1,
                            Style.bg_color_danger,
                        ]}
                    >
                        <Text
                            style={[
                                Style.text_center,
                                Style.f_color_15,
                                Style.f_size_12,
                            ]}
                        >
                            {deliveries.length}
                        </Text>
                    </Div>
                </Div>
            </Div>
            {_.map(deliveries, (delivery: any, index: number) => (
                <DeliveryItem
                    key={index}
                    deliver={deliver}
                    delivery={delivery}
                    onClick={onClick}
                />
            ))}
        </Div>
    );
};

export default WaitingList;
