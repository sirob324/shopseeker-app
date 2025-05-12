import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import Share from "react-native-share";

import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Image from "components/image";
import Swiper from "components/swiper";
import Scroll from "components/scroll";
import MerchantCard from "components/merchant-card";
import LanguageSwitcher from "components/language-switcher";

import { trans } from "locales";

import Style from "style";

import { Merchant } from "interfaces/profile";

import { ADS_HEIGHT } from "config/constant";

import { getAds } from "request/ads";
import { getNearbyShop } from "request/region";

import {
    redirectToDeliverIdentity,
    redirectToMerchantIdentity,
} from "utils/navigation";

type Props = {
    [key: string]: any;
};

const HomePage: FC<Props> = (props) => {
    const { region, location } = props;

    const [adses, setAdses] = useState([]);
    const [merchants, setMerchants] = useState([]);

    const getAdses = async () => {
        const { status, data } = await getAds();

        if (status === "succeeded" && !_.isEmpty(data)) {
            setAdses(data);
        }
    };

    const getMerchants = async () => {
        try {
            const { status, data } = await getNearbyShop({
                condition: {
                    status: "valid",
                    region: region.id,
                },
                location: _.isEmpty(location) ? [] : location,
                distance: 30000,
            });

            console.info(status, data)

            if (status === "succeeded" && !_.isEmpty(data)) {
                setMerchants(data);
            }
        } catch (e) {}
    };

    useEffect(() => {
        getAdses();
    }, []);

    useEffect(() => {
        region.id && _.isEmpty(merchants) && getMerchants();
    }, [region.id]);

    return (
        <Div style={[Style.column, Style.p_h_3, Style.h_p100]}>
            <Div style={[Style.row, Style.column_center, Style.w_p100]}>
                <Text
                    style={[
                        Style.f_size_17,
                        Style.f_weight_500,
                        Style.f_color_first,
                    ]}
                >
                    ShopSeeker
                </Text>
                <Text
                    style={[
                        Style.f_size_11,
                        Style.f_color_dark,
                        Style.f_weight_500,
                        Style.m_l_3,
                    ]}
                >
                    {trans(region.slug)}
                </Text>
                <Div style={[Style.m_l_3]}>
                    <LanguageSwitcher />
                </Div>
            </Div>

            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.bg_color_light,
                    Style.m_t_3,
                    Style.border_round_2,
                    Style.p_h_6,
                    Style.p_v_2,
                ]}
            >
                <Div
                    style={[
                        Style.column,
                        Style.column_center,
                        Style.row_between,
                    ]}
                    onClick={redirectToMerchantIdentity}
                >
                    <Icon
                        name="store-outline"
                        size={Style.f_size_25.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Text style={[Style.f_size_12]}>
                        {trans("beAnMerchant")}
                    </Text>
                </Div>
                <Div
                    style={[
                        Style.column,
                        Style.column_center,
                        Style.row_between,
                    ]}
                    onClick={redirectToDeliverIdentity}
                >
                    <Icon
                        name="delivery-motor"
                        size={Style.f_size_25.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Text style={[Style.f_size_12]}>{trans("beADeliver")}</Text>
                </Div>
                <Div
                    style={[
                        Style.column,
                        Style.column_center,
                        Style.row_between,
                    ]}
                    onClick={() => {
                        Share.open({
                            title: "ShopSeeker",
                            message:
                                "Delivery or pickup groceries in local store.",
                            url: "https://www.shopseeker.com",
                        })
                            .then((res) => {})
                            .catch((err) => {});
                    }}
                >
                    <Icon
                        name="share"
                        size={Style.f_size_25.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Text style={[Style.f_size_12]}>{trans("share")}</Text>
                </Div>
            </Div>

            {!_.isEmpty(adses) && (
                <Div
                    style={[
                        Style.m_t_4,
                        {
                            height: ADS_HEIGHT,
                        },
                    ]}
                >
                    <Swiper
                        style={[Style.border_round_2, Style.overflow_hidden]}
                        loop={true}
                        autoplay={true}
                        autoplayTimeout={4}
                        showsPagination={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        {_.map(adses, (ads: any, index: number) => (
                            <Div
                                key={index}
                                style={[Style.w_p100, Style.h_p100]}
                            >
                                <Image src={ads.banner} />
                            </Div>
                        ))}
                    </Swiper>
                </Div>
            )}

            <Scroll contentContainerStyle={[Style.p_t_2, Style.p_b_6]}>
                {_.map(merchants, (merchant: Merchant, index: number) => (
                    <MerchantCard key={index} item={merchant} />
                ))}
            </Scroll>

            <Div
                style={[
                    Style.bottom_horizontal,
                    Style.h_center,
                    Style.bg_color_15,
                    Style.p_v_1,
                    Style.wrap,
                ]}
            >
                <Div
                    style={[
                        Style.h_center,
                        Style.b_r_light_medium,
                        Style.m_r_1,
                        Style.p_r_1,
                    ]}
                >
                    <Icon
                        name="arrive"
                        size={Style.f_size_15.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark,
                            Style.m_l_1,
                        ]}
                    >
                        {trans("arriveInOneHour")}
                    </Text>
                </Div>
                <Div
                    style={[
                        Style.h_center,
                        Style.b_r_light_medium,
                        Style.m_r_1,
                        Style.p_r_1,
                    ]}
                >
                    <Icon
                        name="quanlity"
                        size={Style.f_size_20.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark,
                            Style.m_l_1,
                        ]}
                    >
                        {trans("quanlityPromise")}
                    </Text>
                </Div>
                <Div style={[Style.h_center, Style.wrap]}>
                    <Icon
                        name="sync"
                        size={Style.f_size_15.fontSize}
                        color={Style.f_color_dark.color}
                    />
                    <Text
                        style={[
                            Style.f_size_11,
                            Style.f_color_dark,
                            Style.m_l_1,
                        ]}
                    >
                        {trans("priceSameWithMerchant")}
                    </Text>
                </Div>
            </Div>
        </Div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        region: state.region,
        locale: state.system.locale,
        location: state.system.location,
    };
};

export default connect(mapStateToProps)(HomePage);
