import React, { FC } from "react";
import _ from "lodash";

import { useSearch } from "contexts/search";

import { ADS_HEIGHT } from "config/constant";

import Div from "components/div";
import Text from "components/text";
import Image from "components/image";
import Swiper from "components/swiper";
import SearchBar from "components/searchbar";

import Style from "style";

import GroceryBanner from "assets/image/grocery.png";

type Props = {
    [key: string]: any;
};

const ShopHeader: FC<Props> = ({ shop, onSearch, headerSticky }) => {
    const { keyword, updateSearch } = useSearch();

    const handleSearchButton = (keyword: string) => {
        updateSearch({
            type: "product",
            keyword,
        });

        onSearch(keyword);
    };

    return (
        <Div
            style={
                headerSticky
                    ? [
                          Style.v_center,
                          Style.bg_color_15,
                          Style.p_4,
                          Style.shadow,
                          Style.top_horizontal,
                          {
                              zIndex: 999,
                          },
                      ]
                    : [Style.v_center, Style.p_h_4, { top: -25 }]
            }
        >
            <Div style={[Style.v_center, Style.w_p100, Style.m_b_4]}>
                <Text
                    style={[
                        Style.f_size_16,
                        Style.f_color_dark_bold,
                        Style.f_weight_600,
                    ]}
                >
                    {_.get(shop, "name", "")}
                </Text>
                {!!_.get(shop, "intro") && (
                    <Text
                        style={[
                            Style.f_color_dark,
                            Style.f_size_13,
                            Style.text_center,
                            Style.m_t_1,
                        ]}
                    >
                        {_.get(shop, "intro", "")}
                    </Text>
                )}
            </Div>

            <Div
                style={[
                    Style.w_p100,
                    Style.border_round_2,
                    Style.overflow_hidden,
                    Style.m_b_4,
                    headerSticky
                        ? {
                              height: 0,
                          }
                        : {
                              height: ADS_HEIGHT,
                          },
                ]}
            >
                {!_.isNil(_.get(shop, "ads")) &&
                !_.isEmpty(_.get(shop, "ads", [])) ? (
                    <Swiper
                        style={[Style.border_round_2, Style.overflow_hidden]}
                        loop={true}
                        autoplay={true}
                        autoplayTimeout={4}
                        showsPagination={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        {_.map(
                            _.get(shop, "ads"),
                            (ads: any, index: number) => (
                                <Div
                                    key={index}
                                    style={[Style.w_p100, Style.h_p100]}
                                >
                                    <Image src={ads.url} />
                                </Div>
                            )
                        )}
                    </Swiper>
                ) : !!_.get(shop, "banner.url") ? (
                    <Image src={_.get(shop, "banner.url")} />
                ) : (
                    <Image src={GroceryBanner} />
                )}
            </Div>

            <SearchBar
                handleSearch={handleSearchButton}
                value={keyword}
                placeholder={_.get(shop, "name", "")}
            />
        </Div>
    );
};

export default ShopHeader;
