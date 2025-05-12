import React, { FC } from "react";
import { View, ViewProps } from "react-native";

import Text from "components/text";

import Style from "style";

const LabelView: FC<ViewProps & { title: string; style?: any }> = ({
    title,
    style,
    children,
}) => {
    return (
        <View
            style={[Style.row, Style.row_start, Style.column_center, ...style]}
        >
            <Text>{title}</Text>
            {children}
        </View>
    );
};

export default LabelView;
