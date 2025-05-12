import React from "react";

import { useMerchant } from "merchant/contexts/app";

import ReadyToCollectOrder from "merchant/widgets/order/ready_to_collect";

const Home = () => {
    const { merchant } = useMerchant();

    return <ReadyToCollectOrder merchant={merchant} />;
};

export default Home;
