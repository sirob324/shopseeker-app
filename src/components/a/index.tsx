import React, { FC } from "react";
import _ from "lodash";
import {
    Pressable,
    PressableProps,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

import Style from "style";

const AView: FC<TouchableOpacityProps> = ({
    onPress,
    children,
    style = {},
    ...rest
}) => {
    const _style: any =
        !_.isNil(style) && _.isArray(style)
            ? _.reduce(
                  style,
                  (res: any, v2: any) => {
                      res = { ...res, ...v2 };
                      return res;
                  },
                  {}
              )
            : _.isObject(style)
            ? style
            : {};

    // return (
    //     <Pressable
    //         onPress={onPress}
    //         style={{
    //             ...Style.p_0,
    //             ...Style.m_0,
    //             ..._style,
    //         }}
    //         {...rest}
    //     >
    //         {children}
    //     </Pressable>
    // );

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                ...Style.p_0,
                ...Style.m_0,
                ..._style,
            }}
            {...rest}
        >
            {children}
        </TouchableOpacity>
    );
};

export default AView;
