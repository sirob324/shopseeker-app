import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { changeLocation as changeLocationAction } from "actions/system";

import { Merchant } from "interfaces/profile";

import { ADS_HEIGHT, DEVICE_HEIGHT, FOOTER_BAR_HEIGHT } from "config/constant";

import Lib from "helpers/lib";

import { getAds } from "request/ads";
import { getNearbyShop } from "request/region";

import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Image from "components/image";
import Swiper from "components/swiper";
import Scroll from "components/scroll";
import MerchantCard from "components/merchant-card";
import ErrorMessage from "components/error-message";
import LanguageSwitcher from "components/language-switcher";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const HomePage: FC<Props> = (props) => {
    const { region, location, changeLocation } = props;

    const [error, setError] = useState("");

    const [adses, setAdses] = useState([]);
    const [merchants, setMerchants] = useState([]);

    const getAdses = async () => {
        const res: any = await getAds();

        if (_.get(res, "status") === "succeeded" && !_.isEmpty(res.data)) {
            setAdses(res.data);
        }
    };

    const getMerchants = async () => {
        let coords: any = [];

        if (!_.isEmpty(location)) {
            coords = location;
        } else {
            const _location: any = await Lib.getCurrentPosition();

            if (!_.isEmpty(_location)) {
                coords = _location;

                changeLocation(_location);
            }
        }

        try {
            const res = await getNearbyShop({
                condition: {
                    status: "valid",
                    region: region.id,
                },
                location: coords,
                distance: 10000000000,
            });

            if (_.get(res, "status") === "succeeded" && !_.isEmpty(res.data)) {
                setMerchants(res.data);
            }
        } catch (e) {
            setError(e.message);
        }
    };

    useEffect(() => {
        getAdses();
    }, []);

    useEffect(() => {
        region.id && _.isEmpty(merchants) && getMerchants();
    }, [region.id]);

    return (
        <Div style={[Style.column, Style.position_relative, Style.bg_color_15]}>
            {!_.isEmpty(adses) && (
                <Swiper
                    style={[Style.w_p100, { height: ADS_HEIGHT + 120 }]}
                    showsHorizontalScrollIndicator={false}
                    data={adses}
                    component={(ads: any) => (
                        <Div style={[Style.w_p100, Style.h_p100]}>
                            <Image src={ads.banner} />
                        </Div>
                    )}
                />
            )}

            {error ? (
                <Div style={[Style.column, Style.row_center, Style.p_2]}>
                    <ErrorMessage message={error} />
                </Div>
            ) : (
                <Div
                    style={[
                        Style.column,
                        Style.position_absolute,
                        Style.w_p100,
                        {
                            top: ADS_HEIGHT + FOOTER_BAR_HEIGHT,
                            height:
                                DEVICE_HEIGHT -
                                ADS_HEIGHT -
                                FOOTER_BAR_HEIGHT -
                                FOOTER_BAR_HEIGHT,
                        },
                    ]}
                >
                    <Div
                        style={[
                            Style.w_p100,
                            Style.row,
                            Style.row_between,
                            Style.column_center,
                            Style.b_b_light_medium,
                            Style.border_round_top_4,
                            Style.bg_color_15,
                            {
                                height: FOOTER_BAR_HEIGHT,
                            },
                        ]}
                    >
                        <Div
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.p_l_4,
                            ]}
                        >
                            <Icon
                                name="location"
                                size={Style.f_size_35.fontSize}
                                color={Style.f_color_first.color}
                            />
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_weight_500,
                                    Style.f_color_dark_bold,
                                    Style.m_l_1,
                                ]}
                            >
                                {trans(region.slug)}
                            </Text>
                        </Div>
                        <Div
                            style={[
                                Style.row,
                                Style.column_center,
                                Style.row_end,
                                Style.p_r_4,
                            ]}
                        >
                            <LanguageSwitcher />
                        </Div>
                    </Div>
                    <Scroll
                        style={[
                            Style.bg_color_15,
                            {
                                height:
                                    DEVICE_HEIGHT -
                                    ADS_HEIGHT -
                                    FOOTER_BAR_HEIGHT,
                            },
                        ]}
                    >
                        {_.map(
                            merchants,
                            (merchant: Merchant, index: number) => (
                                <MerchantCard key={index} item={merchant} />
                            )
                        )}
                    </Scroll>
                </Div>
            )}
        </Div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        locale: state.system.locale,
        region: state.region,
        location: state.system.location,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    changeLocation: (location: []) => dispatch(changeLocationAction(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
