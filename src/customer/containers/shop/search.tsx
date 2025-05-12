import React, { FC, useState } from "react";
import _ from "lodash";
import { NetworkStatus } from "@apollo/client";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Modal from "components/modal";
import Button from "components/button";
import Scroll from "components/scroll";
import Loading from "components/loading";
import NoResultFound from "components/no-result";
import ProductCard from "components/product-card";

import HeaderBar from "containers/bar/header-bar";

import { CartItem } from "interfaces/cart";

import { HEADER_BAR_HEIGHT, STATUS_BAR_HEIGHT } from "config/constant";

import { useQueryMore } from "helpers/apollo";
import { SEARCH_PRODUCTS } from "graphql/query";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const ShopSearchPage: FC<Props> = (props) => {
    const { router, shop } = props;

    const [modalVisible, setModalVisible] = useState(false);

    const [sort, changeSort] = useState<string>(
        _.get(router, "params.sort", "createdAt:desc")
    );

    const where = _.get(router, "params.where", {});

    const condition = {
        sort,
        where: {
            ...where,
            merchant: shop.id,
        },
    };

    const headerLeft = _.get(router, "header.headerLeft");
    const headerTitle = _.get(router, "header.headerTitle");
    const headerRight = _.get(
        router,
        "header.headerRight",
        <A onPress={() => setModalVisible(!modalVisible)} style={[Style.p_r_2]}>
            <Icon
                name="options-outline"
                size={Style.f_size_20.fontSize}
                color={Style.f_color_dark_medium.color}
            />
        </A>
    );

    const headerBar = (
        <HeaderBar
            headerLeft={headerLeft}
            headerTitle={headerTitle}
            headerRight={headerRight}
            style={[Style.bg_color_15, Style.shadow_bottom]}
        />
    );

    const { data, error, fetchMore, networkStatus } = useQueryMore(
        SEARCH_PRODUCTS,
        condition
    );

    const loadingMore = networkStatus === NetworkStatus.fetchMore;

    if (
        (networkStatus === NetworkStatus.loading ||
            networkStatus === NetworkStatus.setVariables ||
            networkStatus === NetworkStatus.ready) &&
        (!data || _.isEmpty(data))
    ) {
        return (
            <Div
                style={[
                    Style.column,
                    Style.bg_color_light,
                    { paddingTop: HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT },
                ]}
            >
                {headerBar}
                <Div style={[Style.v_center, Style.h_100]}>
                    <Loading />
                </Div>
            </Div>
        );
    }

    if (error) {
        return (
            <Div
                style={[
                    Style.column,
                    Style.bg_color_light,
                    { paddingTop: HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT },
                ]}
            >
                {headerBar}
                <Div style={[Style.p_h_4]}>
                    <Text>{trans("error.unknown")}</Text>
                </Div>
            </Div>
        );
    }

    if (_.isEmpty(_.get(data, "moreProducts.items", []))) {
        return (
            <Div
                style={[
                    Style.column,
                    Style.bg_color_light,
                    { paddingTop: HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT },
                ]}
            >
                {headerBar}
                <Div
                    style={[Style.v_center, Style.h_100, Style.bg_color_light]}
                >
                    <NoResultFound />
                </Div>
            </Div>
        );
    }

    const handleLoadMore = () => {
        if (_.get(data, "moreProducts.hasMore") === true) {
            fetchMore({
                variables: {
                    offset: _.toNumber(data.moreProducts.items.length),
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return previousResult;

                    return {
                        moreProducts: {
                            __typename: previousResult.moreProducts.__typename,
                            items: [
                                ...previousResult.moreProducts.items,
                                ...fetchMoreResult.moreProducts.items,
                            ],
                            hasMore: fetchMoreResult.moreProducts.hasMore,
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
                Style.h_p100,
                { paddingTop: HEADER_BAR_HEIGHT },
            ]}
        >
            {headerBar}
            <Scroll
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                contentContainerStyle={[
                    Style.row,
                    Style.column_center,
                    Style.wrap,
                    Style.p_b_2,
                ]}
            >
                {_.map(
                    data.moreProducts.items,
                    (item: CartItem, index: number) => (
                        <Div
                            key={index}
                            style={[Style.p_3, Style.m_b_6, Style.w_p50]}
                        >
                            <ProductCard item={item} showMerchant={false} />
                        </Div>
                    )
                )}
                {_.get(data, "moreProducts.hasMore") === true && (
                    <Div style={[Style.w_p100, Style.v_center, Style.p_v_4]}>
                        <Button
                            size="small"
                            trans="loadMoreBtn"
                            loading={loadingMore}
                            disabled={
                                !_.get(data, "moreProducts.hasMore", false)
                            }
                            onPress={handleLoadMore}
                        />
                    </Div>
                )}
            </Scroll>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="none"
                presentationStyle="overFullScreen"
                onDismiss={() => setModalVisible(false)}
                style={{
                    container: {
                        ...Style.bg_transparent,
                        ...Style.h_p100,
                        paddingTop: HEADER_BAR_HEIGHT + STATUS_BAR_HEIGHT,
                    },
                }}
                renderContent={() => (
                    <Div
                        style={[
                            Style.top_right,
                            Style.bg_color_15,
                            Style.shadow_bottom,
                            Style.border_round_1,
                            Style.p_2,
                        ]}
                    >
                        <A
                            style={[Style.v_center, Style.p_h_2, Style.p_v_1]}
                            onPress={() => {
                                changeSort("price:asc");
                            }}
                        >
                            <Text style={[Style.f_size_13, Style.f_weight_500]}>
                                {trans("priceLTH")}
                            </Text>
                        </A>
                        <A
                            style={[Style.v_center, Style.p_h_2, Style.p_v_1]}
                            onPress={() => {
                                changeSort("price:desc");
                            }}
                        >
                            <Text style={[Style.f_size_13, Style.f_weight_500]}>
                                {trans("priceHTL")}
                            </Text>
                        </A>
                    </Div>
                )}
            />
        </Div>
    );
};

export default ShopSearchPage;
