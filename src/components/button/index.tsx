import React, { FC, ReactNode } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Loading from "components/loading";

import { trans as _trans } from "locales";

import Style from "style";

type Props = {
    size?: "big" | "medium" | "small" | "fullwidth";
    disabled?: boolean;
    loading?: boolean;
    onPress?: any;
    trans?: string;
    title?: string | ReactNode;
    titleStyle?: any;
    style?: object[];
};

const ButtonView: FC<Props> = (props) => {
    const {
        size,
        disabled,
        loading,
        onPress,
        trans,
        title,
        style,
        titleStyle,
    } = props;

    const _title = trans ? _trans(trans) : title || "";

    let wrapperStyle = {
        ...Style.h_center,
        ...Style.border_round_1,
        ...Style.bg_color_primary,
        ...Style.p_1,
        ...style,
    };

    let innerStyle = {
        ...Style.f_size_14,
        ...Style.f_weight_500,
        ...Style.f_color_15,
    };

    if (disabled) {
        wrapperStyle = {
            ...wrapperStyle,
            ...Style.bg_color_light_dark,
        };

        innerStyle = { ...innerStyle, ...Style.f_color_dark_light };
    }

    if (size === "fullwidth") {
        wrapperStyle = {
            ...wrapperStyle,
            ...Style.p_v_2,
            ...Style.w_p100,
        };
    } else if (size === "big") {
        wrapperStyle = {
            ...wrapperStyle,
            ...Style.p_v_2,
        };
    } else if (size === "medium") {
        wrapperStyle = {
            ...wrapperStyle,
            ...Style.p_v_1,
        };
    }

    return (
        <Div style={[Style.v_center, Style.w_p100]}>
            <A
                style={[
                    wrapperStyle,
                    _.reduce(
                        style,
                        (_style: any, stl: any) => {
                            _style = { ..._style, ...stl };
                            return _style;
                        },
                        {}
                    ),
                ]}
                onPress={disabled || loading ? () => {} : onPress}
            >
                <Text
                    style={[
                        innerStyle,
                        _.reduce(
                            titleStyle,
                            (_style: any, stl: any) => {
                                _style = { ..._style, ...stl };
                                return _style;
                            },
                            {}
                        ),
                    ]}
                >
                    {_title}
                </Text>
                {loading && (
                    <Div style={[Style.row, Style.column_center, Style.m_l_2]}>
                        <Loading color={Style.f_color_15.color} />
                    </Div>
                )}
            </A>
        </Div>
    );
};

export default ButtonView;
