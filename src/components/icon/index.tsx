import React, { FC } from "react";

// import Div from "components/div";

import Icon from "./iconfont";

import Style from "style";

type Props = {
    name: string;
    size?: number;
    color?: string;
    style?: any;
    onPress?: any;
};

const Font: FC<Props> = ({
    name,
    size = Style.f_size_20.fontSize,
    color = Style.f_color_dark_medium.color,
    // style = [],
    // onPress,
}) => {
    return (
        // <Div
        //     onPress={onPress}
        //     style={[
        //         Style.row,
        //         Style.column_center,
        //         ...style
        //     ]}
        // >
        <Icon name={name} size={size} color={color} />
        // </Div>
    );
};

export default Font;
