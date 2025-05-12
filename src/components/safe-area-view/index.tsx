import React, { FC } from "react";
import _ from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";

import Style from "style";

const AreaView: FC<any> = ({ children, ...rest }) => {
    return (
        <SafeAreaView style={[Style.bg_color_15, Style.flex]} {...rest}>
            {children}
        </SafeAreaView>
    );
};

export default AreaView;
