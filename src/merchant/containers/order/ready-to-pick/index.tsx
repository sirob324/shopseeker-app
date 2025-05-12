import React from "react";

import { useMerchant } from "merchant/contexts/app";

import OrderReadyToPick from "merchant/widgets/order/ready_to_pick";

const ReadyToPick = () => {
    const { merchant } = useMerchant();

    return <OrderReadyToPick merchant={merchant} />;
};

export default ReadyToPick;
