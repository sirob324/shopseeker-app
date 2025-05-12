import React from "react";
import _ from "lodash";

import { MENU_BUTTON_HEIGHT } from "config/constant";

import Div from "components/div";
import Icon from "components/icon";

import Style from "style";

const NavBar = (props: any) => {
    const leftNav = _.get(props, "leftNav", null);
    const rightNav = _.get(props, "rightNav", null);

    let style = [Style.h_center, Style.bg_transparent, Style.p_h_2];

    if (_.has(props, "style")) {
        style = [...style, ...props.style];
    }

    return (
        <Div
            {..._.omit(props, ["style", "children", "leftNav", "rightNav"])}
            style={style}
        >
            {leftNav || (
                <Icon
                    name="chevron-back"
                    size={Style.f_size_15.fontSize}
                    color={Style.f_color_dark.color}
                />
            )}
            {rightNav && (
                <Div
                    style={[
                        Style.m_h_1,
                        { width: 1, height: MENU_BUTTON_HEIGHT - 15 },
                    ]}
                ></Div>
            )}
            {rightNav}
        </Div>
    );
};

export default NavBar;
