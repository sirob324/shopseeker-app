import React, { FC } from "react";

import Lib from "helpers/lib";

import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";

import Style from "style";

type Props = {
    data: any;
};

const Card: FC<Props> = ({ data }) => {
    return (
        <Div style={[Style.column, Style.row_center]}>
            <Text
                style={[
                    Style.f_size_13,
                    Style.f_weight_500,
                    Style.text_capital,
                ]}
            >{`${data.first_name} ${data.last_name}`}</Text>
            <Div style={[Style.row, Style.column_center, Style.m_v_1]}>
                <Icon
                    name="phone-portrait-outline"
                    size={Style.f_size_15.fontSize}
                    color={Style.f_color_dark_medium.color}
                />
                <Text style={[Style.f_size_13, Style.m_l_1]}>{data.phone}</Text>
            </Div>
            <Text style={[Style.f_size_13]}>{Lib.getAddress(data)}</Text>
        </Div>
    );
};

export default Card;
