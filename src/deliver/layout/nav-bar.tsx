import React, { FC } from "react";
import _ from "lodash";

import { HEADER_BAR_HEIGHT } from "config/constant";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const DeliveryNavbar: FC<Props> = (props) => {
    const { currentNav, changeNav } = props;

    const navs = [
        {
            name: "waiting",
            title: trans("delivery_status_waiting"),
        },
        {
            name: "received",
            title: trans("delivery_status_received"),
        },
        {
            name: "in-delivery",
            title: trans("delivery_status_in_delivery"),
        },
        {
            name: "delivered",
            title: trans("delivery_status_delivered"),
        },
    ];

    return (
        <Div
            style={[
                Style.row,
                Style.column_center,
                Style.w_p100,
                Style.bg_color_15,
                Style.shadow_bottom,
                Style.p_h_2,
                {
                    top: 0,
                    height: HEADER_BAR_HEIGHT,
                },
                ...props.style,
            ]}
        >
            {_.map(navs, (nav: any, index: number) => {
                const actived = currentNav === nav.name;

                return (
                    <A
                        key={index}
                        style={[
                            Style.v_center,
                            actived && Style.bg_color_gray,
                            Style.p_2,
                            Style.border_round_1,
                        ]}
                        onPress={() => changeNav(nav.name)}
                    >
                        <Text
                            style={[
                                Style.f_size_15,
                                Style.f_weight_500,
                                actived && Style.f_color_primary,
                            ]}
                        >
                            {nav.title}
                        </Text>
                    </A>
                );
            })}
        </Div>
    );
};

DeliveryNavbar.defaultProps = {
    style: [],
};

export default DeliveryNavbar;
