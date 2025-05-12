import React, { FC, useState } from "react";
import _ from "lodash";

import Div from "components/div";

import Style from "style";

import DeliveryItem from "./item";

type Props = {
    [key: string]: any;
};

const InDeliveryList: FC<Props> = (props) => {
    const { deliver, deliveries, onClick } = props;

    const [list, setList] = useState(deliveries);

    const callback = (data: any) => {
        if (!_.isEmpty(data)) {
            const { type, payload } = data;
            if (type === "remove") {
                setList(
                    _.filter(
                        list,
                        (delivery: any) => delivery.id !== payload.delivery
                    )
                );
            }
        }
    };

    return (
        <Div style={[Style.column]}>
            {_.map(list, (delivery: any, index: number) => (
                <DeliveryItem
                    key={index}
                    deliver={deliver}
                    delivery={delivery}
                    onClick={onClick}
                    callback={callback}
                />
            ))}
        </Div>
    );
};

export default InDeliveryList;
