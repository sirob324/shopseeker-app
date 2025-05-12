import React, { FC } from "react";
import _ from "lodash";
import RNPickerSelect from "react-native-picker-select";

import Div from "components/div";
import Icon from "components/icon";

import Style from "style";

const Select: FC<{ [key: string]: any }> = ({ options, onChange, ...rest }) => {
    return (
        <Div
            style={[
                Style.w_p100,
                Style.row,
                Style.column_center,
                Style.bg_color_light,
                Style.border_round_1,
            ]}
        >
            <RNPickerSelect
                Icon={() => (
                    <Icon
                        size={Style.f_size_17.fontSize}
                        style={Style.f_color_dark.color}
                        name="chevron-down"
                    />
                )}
                {...rest}
                placeholder={
                    !!_.get(rest, "placeholder")
                        ? { label: _.get(rest, "placeholder") }
                        : {}
                }
                items={options}
                onValueChange={onChange}
                style={{
                    viewContainer: {
                        ...Style.w_p100,
                        ...Style.bg_color_light,
                        ...Style.border_round_1,
                        ...Style.f_size_16,
                        ...Style.f_color_dark_medium,
                        ...Style.p_2,
                    },
                }}
            />
        </Div>
    );
};

export default Select;
