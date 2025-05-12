import React, { useState } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { Router } from "interfaces/router";

import Div from "components/div";
import NoResultFound from "components/no-result";

import { useDeliver } from "deliver/contexts/app";

import FooterBar from "deliver/layout/footer-bar";

import Delivery from "deliver/containers/delivery";
import Statistics from "deliver/containers/statistics";
import Profile from "deliver/containers/profile";
import Init from "deliver/containers/profile/init";

import Style from "style";

const DeliverRoutes = (props: any) => {
    const { deliver } = useDeliver();

    if (!_.isEmpty(deliver) && _.get(deliver, "id", "") === "") {
        return (
            <Div style={[Style.v_center, Style.h_p100]}>
                <NoResultFound />
            </Div>
        );
    }

    if (_.isEmpty(deliver) || !_.get(deliver, "entity", "")) {
        return (
            <Div
                style={[
                    Style.column,
                    Style.row_center,
                    Style.h_p100,
                    Style.bg_color_15,
                ]}
            >
                <Init />
            </Div>
        );
    }

    const [router, changeRouter] = useState<Router>({ route: "delivery" });

    let component = <></>;

    switch (router.route) {
        case "delivery":
            component = (
                <Delivery
                    deliver={deliver}
                    router={router}
                    changeRouter={changeRouter}
                />
            );
            break;

        case "statistics":
            component = <Statistics deliver={deliver} />;
            break;

        case "profile":
            component = <Profile {...props} />;
            break;
    }

    return (
        <Div style={[Style.v_center, Style.h_p100]}>
            <Div
                style={[
                    Style.column,
                    Style.position_relative,
                    Style.overflow_hidden,
                    Style.w_p100,
                    Style.h_p100,
                    Style.bg_color_15,
                ]}
            >
                <Div>{component}</Div>
                <FooterBar router={router} changeRouter={changeRouter} />
            </Div>
        </Div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        locale: state.system.locale,
    };
};

export default connect(mapStateToProps)(DeliverRoutes);
