import React, { FC } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { Router } from "interfaces/router";

import { FOOTER_BAR_HEIGHT } from "config/constant";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";

import Style from "style";

type Props = {
    router: Router;
    changeRouter: (router: Router) => void;
    [key: string]: any;
};

const TabBar: FC<Props> = (props) => {
    const { router, changeRouter, items } = props;

    const itemsSize = _.size(items);

    const routes = [
        {
            route: "home",
            icon: (
                <Text style={[Style.f_size_50, Style.f_color_dark_bold]}></Text>
            ),
            selecedIcon: (
                <Text style={[Style.f_size_50, Style.f_color_first]}></Text>
            ),
        },
        {
            route: "search",
            icon: (
                <Text style={[Style.f_size_50, Style.f_color_dark_bold]}></Text>
            ),
            selecedIcon: (
                <Text style={[Style.f_size_50, Style.f_color_first]}></Text>
            ),
        },
        {
            route: "cart",
            icon: (
                <Div>
                    <Text
                        style={[Style.f_size_45, Style.f_color_dark_bold]}
                    ></Text>
                    {itemsSize > 0 && (
                        <Div
                            style={[
                                Style.top_horizontal,
                                Style.v_center,
                                Style.h_p50,
                                {
                                    left: 4,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    Style.f_color_first,
                                    Style.f_size_12,
                                    Style.f_weight_500,
                                ]}
                            >
                                {itemsSize}
                            </Text>
                        </Div>
                    )}
                </Div>
            ),
            selecedIcon: (
                <Div>
                    <Text style={[Style.f_size_45, Style.f_color_first]}></Text>
                    {itemsSize > 0 && (
                        <Div
                            style={[
                                Style.top_horizontal,
                                Style.v_center,
                                Style.h_p50,
                                {
                                    left: 4,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    Style.f_color_first,
                                    Style.f_size_12,
                                    Style.f_weight_500,
                                ]}
                            >
                                {itemsSize}
                            </Text>
                        </Div>
                    )}
                </Div>
            ),
        },
        {
            route: "profile",
            icon: (
                <Text style={[Style.f_size_45, Style.f_color_dark_bold]}></Text>
            ),
            selecedIcon: (
                <Text style={[Style.f_size_45, Style.f_color_first]}></Text>
            ),
        },
    ];

    let style = [
        Style.row,
        Style.row_around,
        Style.column_center,
        Style.w_p100,
        Style.bg_color_15,
        Style.shadow_top,
        Style.fixed_bottom_horizontal,
        {
            height: FOOTER_BAR_HEIGHT,
        },
    ];

    if (_.has(props, "style")) {
        style = [...style, ...props.style];
    }

    return (
        <Div {..._.omit(props, ["style", "children"])} style={style}>
            {_.map(routes, (route: any, index: number) => {
                const selected = _.isEqual(route.route, router.route);

                return (
                    <Div
                        key={index}
                        style={[
                            Style.v_center,
                            Style.position_relative,
                            Style.w_p25,
                            Style.h_p100,
                        ]}
                    >
                        <A onPress={() => changeRouter({ route: route.route })}>
                            {selected ? route.selecedIcon : route.icon}
                        </A>
                    </Div>
                );
            })}
        </Div>
    );
};

TabBar.defaultProps = {
    style: [],
};

const mapStateToProps = (state) => {
    return {
        items: state.cart.items,
    };
};

export default connect(mapStateToProps)(TabBar);
