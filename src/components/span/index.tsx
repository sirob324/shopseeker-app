import React, { FC } from "react";
import { View, ViewProps } from "react-native";

import Style from "style";

const SpanView: FC<ViewProps> = ({ style, children }) => {
    return (
        <View style={[Style.row, Style.column_center, Style.row_start, style]}>
            {children}
        </View>
    );
};

export default SpanView;
