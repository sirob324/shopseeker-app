import React, { useState } from "react";
import _ from "lodash";

import { FOOTER_BAR_HEIGHT } from "config/constant";

import Div from "components/div";
import Scroll from "components/scroll";

import NavBar from "deliver/layout/nav-bar";

import Waiting from "./waiting";
import Received from "./received";
import InDelivery from "./in-delivery";
import Delivered from "./delivered";

import Style from "style";

const Delivery = (props: any) => {
    const [progress, changeProgress] = useState("waiting");

    const renderView = () => {
        let component: any = null;

        switch (progress) {
            case "waiting":
                component = <Waiting {...props} />;
                break;

            case "received":
                component = <Received />;
                break;

            case "in-delivery":
                component = <InDelivery />;
                break;

            case "delivered":
                component = <Delivered />;
                break;
        }

        return (
            <Div style={[progress !== "waiting" && Style.p_h_2]}>
                <Scroll>{component}</Scroll>
            </Div>
        );
    };

    return (
        <Div
            style={[
                Style.column,
                Style.position_relative,
                Style.h_p100,
                Style.bg_color_15,
                {
                    paddingBottom: FOOTER_BAR_HEIGHT,
                },
            ]}
        >
            <NavBar
                currentNav={progress}
                changeNav={(progress: string) => changeProgress(progress)}
            />
            {renderView()}
        </Div>
    );
};

export default Delivery;
