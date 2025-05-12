import React, { FC, useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { NetworkStatus } from "@apollo/client";

import { CartItem } from "interfaces/cart";
import { Router } from "interfaces/router";
import { Merchant } from "interfaces/profile";

import {
    NAVIGATION_BAR_HEIGHT,
    SEARCH_BAR_HEIGHT,
    DEVICE_WIDTH,
    DEVICE_HEIGHT,
    FOOTER_BAR_HEIGHT,
} from "config/constant";

import { useSearch } from "contexts/search";

import { useQueryMore } from "helpers/apollo";
import { SEARCH_PRODUCTS, SEARCH_MERCHANTS } from "graphql/query";

import HeaderBar from "containers/bar/header-bar";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Scroll from "components/scroll";
import Loading from "components/loading";
import SearchBar from "components/searchbar";
import ProductCard from "components/product-card";
import MerchantCard from "components/merchant-card";

import { trans } from "locales";

import Style from "style";

type Props = {
    router: Router;
    [key: string]: any;
};

const SearchPage: FC<Props> = () => {
    const { type, keyword, updateSearch } = useSearch();

    const region = useSelector((state: any) => state["region"]);

    const [modelName] = useState(type === "merchant" ? "merchant" : "product");

    const isMerchantModel = modelName === "merchant";

    let fixedWhere: object = {
        region: region.id,
    };

    if (isMerchantModel) {
        fixedWhere = {
            ...fixedWhere,
            status: "valid",
            coordinates_null: false,
        };

        if (keyword) {
            fixedWhere = {
                ...fixedWhere,
                name_contains: keyword,
            };
        }
    } else {
        if (keyword) {
            fixedWhere = {
                ...fixedWhere,
                title_contains: keyword,
            };
        }
    }

    const [where, setWhere] = useState<object>(fixedWhere);

    const [sort, changeSort] = useState<string>(
        isMerchantModel ? "name:asc" : "title:asc"
    );

    const [popup, setPopup] = useState(false);

    const condition = {
        sort,
        limit: 20,
    };

    if (!_.isEmpty(where)) {
        _.set(condition, "where", where);
    }

    const headerBar = (
        <HeaderBar style={[Style.bg_color_15]} headerTitle={trans("search")} />
    );

    const handleSearchButton = (keyword: string) => {
        updateSearch({
            type: modelName,
            keyword,
        });

        if (keyword) {
            setWhere((prevWhere) => {
                const where = isMerchantModel
                    ? {
                          name_contains: keyword,
                      }
                    : {
                          title_contains: keyword,
                      };

                return {
                    ...prevWhere,
                    ...where,
                };
            });
        }
    };

    const handleClear = () => {
        updateSearch({
            keyword: "",
        });

        setWhere((prevWhere) => {
            const where = isMerchantModel
                ? {
                      name_contains: "",
                  }
                : {
                      title_contains: "",
                  };

            return {
                ...prevWhere,
                ...where,
            };
        });
    };

    const { data, error, fetchMore, networkStatus } = useQueryMore(
        isMerchantModel ? SEARCH_MERCHANTS : SEARCH_PRODUCTS,
        condition
    );

    const loadingMore = networkStatus === NetworkStatus.fetchMore;

    if (
        (networkStatus === NetworkStatus.loading ||
            networkStatus === NetworkStatus.setVariables ||
            networkStatus === NetworkStatus.ready) &&
        (_.isNil(data) || _.isEmpty(data))
    ) {
        return (
            <Div style={[Style.v_center, Style.h_100]}>
                <Loading />
            </Div>
        );
    }

    if (error) {
        return (
            <Div
                style={[
                    Style.column,
                    Style.row_center,
                    Style.column_start,
                    {
                        paddingTop: NAVIGATION_BAR_HEIGHT + SEARCH_BAR_HEIGHT,
                    },
                ]}
            >
                {headerBar}

                <Div
                    style={[
                        Style.w_p100,
                        Style.bg_color_15,
                        Style.shadow_bottom,
                        Style.p_2,
                        Style.position_fixed,
                        {
                            top: NAVIGATION_BAR_HEIGHT,
                            zIndex: 999,
                        },
                    ]}
                >
                    <SearchBar
                        handleSearch={handleSearchButton}
                        value={isMerchantModel ? keyword : ""}
                        className="searchBar"
                        style={[
                            Style.w_p100,
                            Style.bg_color_light,
                            Style.p_r_2,
                        ]}
                    />
                </Div>

                <Div style={[Style.p_h_4]}>
                    <Text>{trans("error.unknown")}</Text>
                </Div>
            </Div>
        );
    }

    if (
        _.isEmpty(
            _.get(
                data,
                `${isMerchantModel ? "moreMerchants" : "moreProducts"}.items`,
                []
            )
        )
    ) {
        return (
            <Div
                style={[
                    Style.column,
                    Style.row_center,
                    Style.column_start,
                    {
                        paddingTop: NAVIGATION_BAR_HEIGHT + SEARCH_BAR_HEIGHT,
                    },
                ]}
            >
                {headerBar}

                <Div
                    style={[
                        Style.w_p100,
                        Style.bg_color_15,
                        Style.shadow_bottom,
                        Style.p_2,
                        Style.position_fixed,
                        {
                            top: NAVIGATION_BAR_HEIGHT,
                            zIndex: 999,
                        },
                    ]}
                >
                    <SearchBar
                        handleSearch={handleSearchButton}
                        value={isMerchantModel ? keyword : ""}
                        className="searchBar"
                        style={[
                            Style.w_p100,
                            Style.bg_color_light,
                            Style.p_r_2,
                        ]}
                    />
                </Div>

                {isMerchantModel && _.get(where, "name_contains") && (
                    <Div style={[Style.w_p100, Style.h_center, Style.p_h_4]}>
                        <Text>{trans("noProductFound")}</Text>
                    </Div>
                )}

                {!isMerchantModel && _.get(where, "title_contains") && (
                    <Div style={[Style.w_p100, Style.h_center, Style.p_h_4]}>
                        <Text>{trans("noProductFound")}</Text>
                    </Div>
                )}
            </Div>
        );
    }

    const onFetchMore = () => {
        if (
            _.get(
                data,
                `${isMerchantModel ? "moreMerchants" : "moreProducts"}.hasMore`
            ) === true
        ) {
            fetchMore({
                variables: {
                    offset: _.size(
                        _.get(
                            data,
                            `${
                                isMerchantModel
                                    ? "moreMerchants"
                                    : "moreProducts"
                            }.items`
                        )
                    ),
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return previousResult;

                    return {
                        [isMerchantModel ? "moreMerchants" : "moreProducts"]: {
                            __typename:
                                previousResult[
                                    isMerchantModel
                                        ? "moreMerchants"
                                        : "moreProducts"
                                ].__typename,
                            items: [
                                ...previousResult[
                                    isMerchantModel
                                        ? "moreMerchants"
                                        : "moreProducts"
                                ].items,
                                ...fetchMoreResult[
                                    isMerchantModel
                                        ? "moreMerchants"
                                        : "moreProducts"
                                ].items,
                            ],
                            hasMore:
                                fetchMoreResult[
                                    isMerchantModel
                                        ? "moreMerchants"
                                        : "moreProducts"
                                ].hasMore,
                        },
                    };
                },
            });
        }
    };

    return (
        <Div
            style={[
                Style.column,
                Style.overflow_hidden,
                Style.bg_color_15,
                {
                    paddingTop: NAVIGATION_BAR_HEIGHT + SEARCH_BAR_HEIGHT,
                },
            ]}
        >
            {headerBar}

            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_between,
                    Style.w_p100,
                    Style.bg_color_15,
                    Style.shadow_bottom,
                    Style.p_2,
                    Style.position_fixed,
                    {
                        top: NAVIGATION_BAR_HEIGHT,
                        zIndex: 999,
                    },
                ]}
            >
                <SearchBar
                    handleSearch={handleSearchButton}
                    onClear={handleClear}
                    value={isMerchantModel ? keyword : ""}
                    className="searchBar"
                    style={[Style.bg_color_gray, Style.p_r_2, { width: "80%" }]}
                />
                <Div
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.row_end,
                        Style.w_p20,
                    ]}
                >
                    <A style={[Style.m_r_6]} onPress={() => setPopup(!popup)}>
                        <Icon
                            name="options-outline"
                            size={Style.f_size_50.fontSize}
                            color={Style.f_color_dark.color}
                        />
                    </A>
                    {popup && isMerchantModel ? (
                        <Div
                            style={[
                                Style.v_center,
                                Style.bg_color_15,
                                Style.shadow,
                                Style.p_h_4,
                                Style.p_t_2,
                                Style.border_round_2,
                                Style.top_right,
                                {
                                    zIndex: 999,
                                    right: 20,
                                    top: SEARCH_BAR_HEIGHT,
                                },
                            ]}
                        >
                            <A
                                style={[Style.p_b_2]}
                                onPress={() => {
                                    changeSort("name:asc");
                                    setPopup(!popup);
                                }}
                            >
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_dark,
                                        Style.f_weight_500,
                                    ]}
                                >
                                    {trans("titleLTH")}
                                </Text>
                            </A>
                            <A
                                style={[Style.p_b_2]}
                                onPress={() => {
                                    changeSort("name:desc");
                                    setPopup(!popup);
                                }}
                            >
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_dark,
                                        Style.f_weight_500,
                                    ]}
                                >
                                    {trans("titleHTL")}
                                </Text>
                            </A>
                        </Div>
                    ) : popup && !isMerchantModel ? (
                        <Div
                            style={[
                                Style.top_right,
                                Style.shadow,
                                Style.v_center,
                                Style.p_2,
                                Style.border_round_2,
                                {
                                    zIndex: 999,
                                    right: 10,
                                    top: 55,
                                    width: 120,
                                },
                            ]}
                        >
                            <A
                                style={[Style.p_h_2, Style.p_v_1]}
                                onPress={() => {
                                    changeSort("title:asc");
                                    setPopup(!popup);
                                }}
                            >
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_dark,
                                        Style.f_weight_500,
                                    ]}
                                >
                                    {trans("titleLTH")}
                                </Text>
                            </A>
                            <A
                                style={[Style.p_h_2, Style.p_v_1]}
                                onPress={() => {
                                    changeSort("title:desc");
                                    setPopup(!popup);
                                }}
                            >
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_dark,
                                        Style.f_weight_500,
                                    ]}
                                >
                                    {trans("titleHTL")}
                                </Text>
                            </A>
                            <A
                                style={[Style.p_h_2, Style.p_v_1]}
                                onPress={() => {
                                    changeSort("price:asc");
                                    setPopup(!popup);
                                }}
                            >
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_dark,
                                        Style.f_weight_500,
                                    ]}
                                >
                                    {trans("priceLTH")}
                                </Text>
                            </A>
                            <A
                                style={[Style.p_h_2, Style.p_v_1]}
                                onPress={() => {
                                    changeSort("price:desc");
                                    setPopup(!popup);
                                }}
                            >
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_color_dark,
                                        Style.f_weight_500,
                                    ]}
                                >
                                    {trans("priceHTL")}
                                </Text>
                            </A>
                        </Div>
                    ) : null}
                </Div>
            </Div>

            <Scroll
                automaticallyAdjustContentInsets={false}
                onMomentumScrollEnd={(e) => {
                    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
                    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
                    var oriageScrollHeight =
                        e.nativeEvent.layoutMeasurement.height; //scrollView高度
                    if (offsetY + oriageScrollHeight >= contentSizeHeight) {
                        onFetchMore();
                    }
                }}
                style={[
                    Style.bg_color_15,
                    {
                        height:
                            DEVICE_HEIGHT -
                            NAVIGATION_BAR_HEIGHT -
                            SEARCH_BAR_HEIGHT -
                            FOOTER_BAR_HEIGHT,
                    },
                ]}
            >
                {isMerchantModel ? (
                    _.map(
                        _.get(data, "moreMerchants.items", []),
                        (merchant: Merchant, index: number) => (
                            <MerchantCard key={index} item={merchant} />
                        )
                    )
                ) : (
                    <Div
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.wrap,
                            Style.p_l_4,
                        ]}
                    >
                        {_.map(
                            _.get(data, "moreProducts.items", []),
                            (item: CartItem, index: number) => (
                                <Div
                                    key={index}
                                    style={[
                                        Style.v_center,
                                        Style.m_r_4,
                                        Style.m_v_2,
                                        { width: (DEVICE_WIDTH - 60) / 2 },
                                    ]}
                                >
                                    <ProductCard
                                        item={item}
                                        showMerchant={true}
                                    />
                                </Div>
                            )
                        )}
                    </Div>
                )}
                <Div style={[Style.v_center]}>
                    {_.get(
                        data,
                        `${
                            isMerchantModel ? "moreMerchants" : "moreProducts"
                        }.hasMore`
                    ) === false
                        ? null
                        : loadingMore && (
                              <Loading
                                  size={Style.f_size_35.fontSize}
                                  color={Style.f_color_dark.color}
                              />
                          )}
                </Div>
            </Scroll>
        </Div>
    );
};

export default SearchPage;
