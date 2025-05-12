import React, { useState } from "react";
import _ from "lodash";

import { FOOTER_BAR_HEIGHT } from "config/constant";

import Div from "components/div";

import NavBar from "merchant/layout/nav-bar";

import ReadyToPick from "./ready-to-pick";
import Picking from "./picking";
import ReadyToPickup from "./ready-to-pick-up";

import Style from "style";

const OrderPage = (props: any) => {
    const [progress, changeProgress] = useState("ready-to-pick");

    const renderView = () => {
        let component: any = null;

        switch (progress) {
            case "ready-to-pick":
                component = <ReadyToPick {...props} />;
                break;

            case "picking":
                component = <Picking />;
                break;

            case "ready-to-pick-up":
                component = <ReadyToPickup />;
                break;
        }

        return <Div style={[Style.p_h_2]}>{component}</Div>;
    };

    return (
        <Div
            style={[
                Style.column,
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

export default OrderPage;
