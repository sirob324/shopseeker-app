import React, { FC } from "react";
import _ from "lodash";

import { Card } from "interfaces/profile";

import Div from "components/div";
import Swiper from "components/swiper";
import PaymentCard from "components/payment-card";

import Style from "style";

interface Props {
    items: Card[];
    value?: Card;
    onChange?: Function;
    onDelete: Function;
}

const PaymentGroup: FC<Props> = ({ items, value, onChange, onDelete }) => {
    return items.length > 0 ? (
        <Div style={[Style.column, Style.w_p100, Style.m_t_2]}>
            <Swiper
                loop={false}
                autoplay={false}
                showsPagination={false}
                showsHorizontalScrollIndicator={false}
            >
                {_.map(items, (item: Card, index: number) => (
                    <PaymentCard
                        key={index}
                        onChange={onChange ? () => onChange(item) : undefined}
                        onDelete={() => onDelete(item)}
                        item={item}
                        value={value}
                    />
                ))}
            </Swiper>
        </Div>
    ) : null;
};

export default PaymentGroup;
