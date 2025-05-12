import React, { FC, useState } from "react";
import _ from "lodash";
import { TextInput, TextInputProps } from "react-native";

import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Label from "components/label";

import { trans } from "locales";

import Style from "style";

type Props = {
    type?:
        | "text"
        | "default"
        | "email-address"
        | "numeric"
        | "phone-pad"
        | "number-pad"
        | "decimal-pad"
        | "ascii-capable"
        | "numbers-and-punctuation"
        | "url"
        | "name-phone-pad"
        | "twitter"
        | "web-search"
        | "visible-password";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: boolean;
    defaultValue?: string;
    disabled?: boolean;
    placeholder?: string;
    placeholderTextColor?: string;
    editable?: boolean;
    autoFocus?: boolean;
    focus?: boolean;
    onBlur?: any;
    onFocus?: any;
    onChange?: any;
    onConfirm?: any;

    value?: any;
    secureTextEntry?: boolean;
    maxlength?: number;
    confirmType?:
        | "send"
        | "search"
        | "next"
        | "go"
        | "done"
        | "default"
        | "google"
        | "join"
        | "route"
        | "yahoo"
        | "emergency-call"
        | "none"
        | "previous";

    label?: string;
    labelTrans?: string;
    labelStyle?: object[];
    note?: string;
    noteTrans?: string;
    noteStyle?: object[];
    style?: any;
    innerStyle?: object;

    textAlign?: "left" | "center" | "right";
    multiline?: boolean;

    [key: string]: any;
};

const Input: FC<TextInputProps> = (props) => {
    let _style: any = {
        ...Style.input,
    };

    if (_.has(props, "style")) {
        _style = _.assign(_style, props.style);
    }

    return (
        <Div style={[Style.row, Style.column_center, Style.w_p100]}>
            {(_.get(props, "disabled") === true ||
                _.get(props, "editable") === false) && (
                <Icon
                    name="disable"
                    size={Style.f_size_15.fontSize}
                    color={Style.f_color_dark.color}
                    style={[Style.m_l_1]}
                />
            )}
            <TextInput
                {..._.omit(props, ["style", "children"])}
                style={_style}
            />
        </Div>
    );
};

const InputView: FC<Props> = ({
    value,
    type,
    autoCapitalize = "none",
    autoCorrect = false,
    defaultValue,
    secureTextEntry,
    maxlength,
    placeholder,
    placeholderTextColor,
    focus,
    autoFocus,
    label,
    labelTrans,
    labelStyle,
    note,
    noteTrans,
    style,
    innerStyle,
    onChange,
    onFocus,
    onBlur,
    confirmType,
    onConfirm,
    textAlign,
    multiline,
    ...rest
}) => {
    let _containerStyle = {
        ...Style.w_p100,
        ...Style.row,
        ...Style.row_start,
        ...Style.column_center,
        ...Style.bg_color_light,
        ...Style.border_round_1,
        height: 50,
    };

    if (style) {
        if (_.isArray(style)) {
            _.forEach(style, (value: any) => {
                _containerStyle = {
                    ..._containerStyle,
                    ...value,
                };
            });
        } else if (_.isPlainObject(style)) {
            _containerStyle = {
                ..._containerStyle,
                ...style,
            };
        }
    }

    let _innerStyle = {};

    if (innerStyle) {
        if (_.isArray(innerStyle)) {
            _.forEach(innerStyle, (value: any) => {
                _innerStyle = {
                    ..._innerStyle,
                    ...value,
                };
            });
        } else if (_.isPlainObject(innerStyle)) {
            _innerStyle = {
                ..._innerStyle,
                ...innerStyle,
            };
        }
    }

    const [_value, _setValue] = useState(value || "");

    const [_focus, _setFocus] = useState(focus || false);

    let _label = label || "";

    if (labelTrans) {
        _label = trans(labelTrans);
    }

    let _note = note || "";

    if (noteTrans) {
        _note = trans(noteTrans);
    }

    const _type = type === "text" ? "default" : type || "default";

    const _disabled = _.get(rest, "disabled", !_.get(rest, "editable", true));

    let _placeholderTextColor =
        placeholderTextColor || Style.f_color_dark.color;

    if (_disabled) {
        _containerStyle = {
            ..._containerStyle,
            ...Style.p_l_2,
        };

        _innerStyle = {
            ..._innerStyle,
            ...Style.f_color_dark_medium,
        };
    }

    const _onChange = (value: string) => {
        _setValue(value);

        onChange && onChange(value);
    };

    const _onFocus = (event: any) => {
        _setFocus(true);

        onFocus && onFocus(event);
    };

    const _onBlur = ({ text }: any) => {
        _setFocus(false);

        onBlur && onBlur(text);
    };

    return (
        <Div style={_containerStyle}>
            {_label !== "" && <Label style={labelStyle || []} title={_label} />}
            <Input
                value={_value}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                defaultValue={defaultValue}
                keyboardType={_type}
                returnKeyType={confirmType}
                secureTextEntry={!!secureTextEntry}
                placeholder={placeholder}
                placeholderTextColor={_placeholderTextColor}
                editable={!_disabled}
                onChangeText={_onChange}
                autoFocus={autoFocus || false}
                onFocus={_onFocus}
                onBlur={_onBlur}
                style={_innerStyle}
                maxLength={maxlength}
                onSubmitEditing={onConfirm}
                textAlign={textAlign || "left"}
                multiline={multiline || false}
                {...rest}
            />
            {_note !== "" && <Text style={labelStyle || []}>{_note}</Text>}
        </Div>
    );
};

export default InputView;
