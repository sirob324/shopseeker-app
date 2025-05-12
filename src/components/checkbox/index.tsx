import React, { FC } from "react";
import { GestureResponderEvent } from "react-native";

import A from "components/a";
import Icon from "components/icon";

import Style from "style";

type Props = {
    value: any;
    onChange: (event: GestureResponderEvent) => void;
};

const Checkbox: FC<Props> = ({ onChange, value }) => {
    return (
        <A onPress={() => onChange(!!!value)}>
            <Icon
                name={value ? "checkbox-selected" : "checkbox"}
                color={Style.f_color_dark_medium.color}
                size={Style.f_size_30.fontSize}
            />
        </A>
    );
};

export default Checkbox;
