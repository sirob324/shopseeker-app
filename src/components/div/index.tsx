import React, { FC } from "react";
import _ from "lodash";
import { View, ViewProps, TouchableWithoutFeedback } from "react-native";

type Props = {
    [key: string]: any;
};

const DivView: FC<ViewProps & Props> = (props) => {
    const { style, children } = props;

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

    if (_.has(props, "onClick") && _.get(props, "onClick")) {
        return (
            <TouchableWithoutFeedback onPress={props.onClick}>
                <View
                    style={_style}
                    {..._.omit(props, ["style", "onClick", "children"])}
                >
                    {children}
                </View>
            </TouchableWithoutFeedback>
        );
    } else if (_.has(props, "onPress") && _.get(props, "onPress")) {
        return (
            <TouchableWithoutFeedback onPress={props.onPress}>
                <View
                    style={_style}
                    {..._.omit(props, ["style", "onPress", "children"])}
                >
                    {children}
                </View>
            </TouchableWithoutFeedback>
        );
    } else {
        return (
            <View style={_style} {..._.omit(props, ["style", "children"])}>
                {children}
            </View>
        );
    }
};

export default DivView;
