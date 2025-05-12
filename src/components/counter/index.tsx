import React, { FC } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";

import Style from "style";

interface Props {
    type?: "horizontal" | "vertical";
    value: number;
    onDec: any;
    onInc: any;
}

export const CounterWidth = 30;

export const CounterHeight = 40;

const Counter: FC<Props> = ({ type, value, onDec, onInc }) => {
    return type === "horizontal" ? (
        <Div
            style={[
                Style.absolute_fill,
                Style.overflow_hidden,
                Style.v_center,
                Style.bg_color_15_transparent_5,
                Style.p_2,
            ]}
        >
            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.w_p100,
                    Style.bg_color_15,
                    Style.shadow,
                    Style.border_round_5,
                    {
                        height: CounterHeight,
                    },
                ]}
            >
                <A
                    onPress={onDec}
                    style={[Style.h_center, Style.w_p40, Style.h_p100]}
                >
                    {_.toInteger(value) > 1 ? (
                        <Icon
                            name="remove"
                            size={Style.f_size_20.fontSize}
                            color={Style.f_color_primary.color}
                        />
                    ) : (
                        <Icon
                            name="trash-outline"
                            size={Style.f_size_20.fontSize}
                            color={Style.f_color_primary.color}
                        />
                    )}
                </A>
                <Div style={[Style.h_center, Style.w_p20, Style.h_p100]}>
                    <Text
                        style={[
                            Style.f_size_12,
                            Style.f_color_primary,
                            Style.f_weight_600,
                            Style.text_center,
                        ]}
                    >
                        {value}
                    </Text>
                </Div>
                <A
                    onPress={onInc}
                    style={[Style.h_center, Style.w_p40, Style.h_p100]}
                >
                    <Icon
                        name="add"
                        size={Style.f_size_20.fontSize}
                        color={Style.f_color_primary.color}
                    />
                </A>
            </Div>
        </Div>
    ) : (
        <Div
            style={[
                Style.column,
                Style.row_center,
                Style.column_stretch,
                Style.bg_color_15,
                Style.shadow,
                Style.border_round_3,
                Style.left_vertical,
                {
                    width: CounterWidth,
                },
            ]}
        >
            <A
                onPress={onDec}
                style={[Style.v_center, Style.w_p100, Style.h_p35]}
            >
                {_.toInteger(value) > 1 ? (
                    <Icon
                        name="remove"
                        size={Style.f_size_15.fontSize}
                        color={Style.f_color_primary.color}
                    />
                ) : (
                    <Icon
                        name="trash-outline"
                        size={Style.f_size_15.fontSize}
                        color={Style.f_color_primary.color}
                    />
                )}
            </A>
            <Div style={[Style.v_center, Style.w_p100, Style.h_p30]}>
                <Text
                    style={[
                        Style.f_size_12,
                        Style.f_color_primary,
                        Style.f_weight_600,
                        Style.text_center,
                    ]}
                >
                    {value}
                </Text>
            </Div>
            <A
                onPress={onInc}
                style={[Style.v_center, Style.w_p100, Style.h_p35]}
            >
                <Icon
                    name="add"
                    size={Style.f_size_15.fontSize}
                    color={Style.f_color_primary.color}
                />
            </A>
        </Div>
    );
};

Counter.defaultProps = {
    type: "horizontal",
};

export default Counter;
