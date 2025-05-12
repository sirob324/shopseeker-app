import React, { FC } from "react";
import _ from "lodash";

import { Card } from "interfaces/profile";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";

import Style from "style";

import RealCard from "./card";

type Props = {
    item: Card;
    onDelete?: any;
};

const PaymentCard: FC<Props> = (props) => {
    const { item, onDelete } = props;

    return (
        <Div
            style={[
                Style.row,
                Style.row_between,
                Style.column_center,
                Style.w_p100,
            ]}
        >
            <RealCard {...item} />

            {onDelete && (
                <A onPress={onDelete || undefined}>
                    <Icon
                        name="trash-outline"
                        size={Style.f_size_20.fontSize}
                        color={Style.f_color_dark.color}
                    />
                </A>
            )}
        </Div>
    );
};

export default PaymentCard;
