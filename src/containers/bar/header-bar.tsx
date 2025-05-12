import React, { FC } from "react";
import _ from "lodash";

import { MENU_BUTTON_RIGHT, HEADER_BAR_HEIGHT } from "config/constant";

import Div from "components/div";
import Text from "components/text";

import Style from "style";

type Props = {
    style?: any[];
    [key: string]: any;
};

const HeaderBar: FC<Props> = ({
    style,
    headerLeft,
    headerTitle,
    headerRight,
}) => {
    let _style = [
        Style.row,
        Style.column_center,
        Style.w_p100,
        Style.bg_transparent,
        Style.top_horizontal,
        Style.z_index_1000,
        {
            height: HEADER_BAR_HEIGHT,
        },
    ];

    if (style && !_.isEmpty(style)) {
        _style = [..._style, ...style];
    }

    return (
        <Div style={_style}>
            <Div
                style={[
                    Style.w_30,
                    Style.row,
                    Style.column_center,
                    Style.row_start,
                    {
                        paddingLeft: MENU_BUTTON_RIGHT,
                    },
                ]}
            >
                {!_.isNil(headerLeft) && headerLeft}
            </Div>
            <Div style={[Style.h_center, Style.w_40]}>
                {!_.isNil(headerTitle) && (
                    <Text
                        style={[
                            Style.f_size_16,
                            Style.f_color_dark_bold,
                            Style.f_weight_600,
                        ]}
                    >
                        {headerTitle}
                    </Text>
                )}
            </Div>
            <Div
                style={[
                    Style.w_30,
                    Style.row,
                    Style.column_center,
                    Style.row_end,
                    {
                        paddingRight: MENU_BUTTON_RIGHT,
                    },
                ]}
            >
                {!_.isNil(headerRight) && headerRight}
            </Div>
        </Div>
    );
};

export default HeaderBar;
