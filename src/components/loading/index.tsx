import React, { FC } from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";
import _ from "lodash";

import Div from "components/div";

import Style from "style";

const LoadingView: FC<ActivityIndicatorProps> = ({
    size,
    color,
    style,
    ...rest
}) => {
    return (
        <Div style={[Style.h_center, Style.h_p100, style]}>
            <ActivityIndicator
                {...rest}
                size={size || "small"}
                color={color || Style.f_color_first.color}
            />
        </Div>
    );
};

export default LoadingView;
