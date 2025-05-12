import React, { FC } from "react";
import { ViewProps } from "react-native";

import Div from "components/div";

import Style from "style";

const Divider: FC<ViewProps> = ({ children, style }) => {
    return (
        <Div style={[Style.theme_header, { height: 3 }, style]}>{children}</Div>
    );
};

export default Divider;
