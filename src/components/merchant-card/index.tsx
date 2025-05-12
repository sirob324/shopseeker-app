import React, { FC } from "react";
import _ from "lodash";

import { Merchant } from "interfaces/profile";

import { redirectToShop } from "utils/navigation";

import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Image from "components/image";

import Style from "style";

interface Props {
    item: Merchant;
    style?: any[];
}

const MerchantCard: FC<Props> = ({ item, style = [] }) => {
    const { id, name, logo, intro } = item;

    return (
        <Div
            style={[
                Style.row,
                Style.row_between,
                Style.column_center,
                Style.p_2,
                Style.b_b_light,
                ...style,
            ]}
            onClick={() => {
                redirectToShop({ id });
            }}
        >
            <Div style={[Style.row, Style.column_center]}>
                <Div
                    style={[
                        Style.v_center,
                        Style.b_img,
                        Style.border_round_5,
                        Style.overflow_hidden,
                    ]}
                >
                    <Image
                        src={logo}
                        style={[
                            Style.overflow_hidden,
                            {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                            },
                        ]}
                    />
                </Div>
                <Div
                    style={[
                        Style.flex,
                        Style.column,
                        Style.row_center,
                        Style.column_start,
                        Style.m_h_4,
                    ]}
                >
                    <Text style={[Style.f_size_14, Style.f_weight_500]}>
                        {name}
                    </Text>
                    {!!intro && (
                        <Text
                            style={[
                                Style.f_size_12,
                                Style.f_color_dark,
                                Style.m_t_1,
                            ]}
                        >
                            {intro}
                        </Text>
                    )}
                </Div>
            </Div>
            <Div style={[Style.v_center]}>
                <Icon
                    name="chevron-forward"
                    size={10}
                    color={Style.f_color_dark_light.color}
                />
            </Div>
        </Div>
    );
};

export default MerchantCard;
