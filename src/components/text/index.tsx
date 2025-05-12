import React, { FC } from "react";
import _ from "lodash";
import { Text, TextProps } from "react-native";

import Style from "style";

const TextView: FC<TextProps & { [key: string]: any }> = ({
    style,
    children,
    ...rest
}) => {
    let __style = {
        ...Style.text_left,
        ...Style.f_color_dark_medium,
        ...Style.f_size_default,
        ...Style.f_weight_default,
        ...Style.l_h_default,
    };

    const _style: any =
        !_.isNil(style) && _.isArray(style)
            ? _.reduce(
                  style,
                  (res: any, v2: any) => {
                      if (_.isArray(v2)) {
                          _.map(v2, (value: any) => {
                              res = {
                                  ...res,
                                  ...value,
                              };
                          });
                      } else if (_.isObject(v2)) {
                          res = { ...res, ...v2 };
                      }

                      return res;
                  },
                  {}
              )
            : _.isObject(style)
            ? style
            : {};

    return (
        <Text ellipsizeMode="tail" {...rest} style={_.assign(__style, _style)}>
            {children}
        </Text>
    );
};

export default TextView;
