import React, { FC, CSSProperties } from "react";
import _ from "lodash";
import {
    KeyboardAwareScrollView,
    KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";

export const Scroll: FC<KeyboardAwareScrollViewProps> = (props) => {
    const { style, children } = props;

    const _style: CSSProperties =
        !_.isNil(style) && _.isArray(style)
            ? _.reduce(
                  style,
                  (v1: any, v2: any) => {
                      v1 = { ..._style, ...v2 };
                      return v1;
                  },
                  {}
              )
            : style;

    return (
        <KeyboardAwareScrollView
            style={style}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            {..._.omit(props, ["style", "children"])}
        >
            {children}
        </KeyboardAwareScrollView>
    );
};

export default Scroll;
