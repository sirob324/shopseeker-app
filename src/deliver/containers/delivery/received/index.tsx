import React, { FC } from "react";
import _ from "lodash";

import { useDeliver } from "deliver/contexts/app";

import { redirectToDeliveryDetail } from "utils/navigation";

import { useQueryMore } from "helpers/apollo";
import { RECEIVED_DELIVERIES } from "deliver/graphql/query";

import Div from "components/div";
import Loading from "components/loading";
import NoResultFound from "components/no-result";
import ErrorMessage from "components/error-message";

import DeliveryList from "./list";

import Style from "style";

type Props = {
    [key: string]: any;
};

const ReceivedDelivery: FC<Props> = () => {
    const { deliver } = useDeliver();

    const { data, error, loading } = useQueryMore(RECEIVED_DELIVERIES, {
        deliver: deliver.id,
    });

    if (loading) {
        return (
            <Div style={[Style.v_center, Style.h_p100]}>
                <Loading />
            </Div>
        );
    }

    if (error) return <ErrorMessage message={error.message} />;

    if (_.isEmpty(_.get(data, "moreDeliveries.items", []))) {
        return (
            <Div style={[Style.v_center, Style.h_p100]}>
                <NoResultFound />
            </Div>
        );
    }

    const handleClick = (item: any) => redirectToDeliveryDetail(item);

    return (
        <DeliveryList
            deliver={deliver}
            deliveries={data.moreDeliveries.items}
            onClick={handleClick}
        />
    );
};

export default ReceivedDelivery;
