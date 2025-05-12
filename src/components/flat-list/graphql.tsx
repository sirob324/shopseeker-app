import React, { Component, ReactElement } from "react";
import { FlatList, FlatListProps } from "react-native";
import _ from "lodash";
import dayjs from "dayjs";
import { ActivityIndicator } from "react-native";

import { FETCH_LIMIT } from "config/constant";

import Config from "config";
import Locales from "locales";

import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

import Div from "components/div";
import Text from "components/text";
import NoResultFound from "components/no-result";

import Style from "style";

const now = dayjs().toISOString();

interface Props {
    reloadToken?: any;
    listViewToken?: any;
    reloadListView?: any;
    latestListView?: any;
    select: string[];
    from: string;
    where: object;
    order: string;
    latest?: string;
    size?: number;
    renderSeparator?: any;
    renderEmptyList?: any;
    renderHeader?: any;
    renderFooter?: any;
    renderItem?: any;
    itemType?: string;
    itemComponent?: any;
    newItem?:
        | {
              type?: string;
              payload?: any;
          }
        | null
        | undefined;
    [key: string]: any;
}

interface States {
    list: any[];
    currentPage: number;
    pages: number;
    count?: number;
    refreshing: boolean;
    lastTime: any;
}

class FlatListViewWithGraphql extends Component<
    Props & FlatListProps<any>,
    States
> {
    state = {
        list: [],
        currentPage: 0,
        pages: 0,
        count: 0,
        refreshing: true,
        lastTime: now,
    };

    componentDidMount() {
        this._requestData();
    }

    componentDidUpdate(prevProps: Props) {
        const {
            reloadToken,
            listViewToken,
            reloadListView,
            latestListView,
            newItem,
        } = this.props;

        const { list } = this.state;

        if (
            !_.isNil(prevProps.reloadToken) &&
            !_.isNil(reloadToken) &&
            !_.isEqual(prevProps.reloadToken, reloadToken)
        ) {
            this.setState(
                {
                    list: [],
                    currentPage: 0,
                    pages: 0,
                    refreshing: true,
                    lastTime: now,
                },
                () => {
                    this._requestData();
                }
            );
        }

        if (
            !_.isNil(listViewToken) &&
            !_.isNil(reloadListView) &&
            !_.isEqual(prevProps.reloadListView, reloadListView)
        ) {
            this.setState(
                {
                    list: [],
                    currentPage: 0,
                    pages: 0,
                    refreshing: true,
                    lastTime: now,
                },
                () => {
                    reloadListView(listViewToken);
                    this._requestData();
                }
            );
        }

        if (
            !_.isNil(listViewToken) &&
            !_.isNil(latestListView) &&
            !_.isEqual(prevProps.latestListView, latestListView)
        ) {
            this._onRefresh();
        }

        if (
            !_.isNil(newItem) &&
            !_.isEmpty(newItem) &&
            !_.isEqual(prevProps.newItem, newItem)
        ) {
            const type: string = _.get(newItem, "type");
            const payload: any = _.get(newItem, "payload");

            if (_.isEmpty(list)) {
                if (type === "add") {
                    this.setState({ list: [payload] });
                }
            } else {
                if (type === "remove") {
                    this.setState({
                        list: _.filter(list, (item: any) => {
                            if (_.isPlainObject(payload)) {
                                return item.id !== payload.id;
                            } else {
                                return item.id !== payload;
                            }
                        }),
                    });
                }

                if (type === "add") {
                    this.setState({
                        list: _.concat(payload, list),
                    });
                }

                if (type === "change") {
                    this.setState({
                        list: _.map(list, (item: any) => {
                            if (
                                _.get(payload, "id") &&
                                _.get(item, "id") === _.get(payload, "id")
                            ) {
                                return {
                                    ...item,
                                    ...payload,
                                };
                            } else {
                                return item;
                            }
                        }),
                    });
                }
            }
        }
    }

    _onRefresh = () => {
        this.setState(
            {
                refreshing: true,
            },
            () => {
                this._requestLatest();
            }
        );
    };

    _endReached = () => {
        const { currentPage, pages } = this.state;

        if (pages !== 0 || currentPage < pages) {
            this._requestData();
        }
    };

    _requestData = () => {
        const { currentPage, list } = this.state;

        const { select, from, where, order, size } = this.props;

        const limit = size || FETCH_LIMIT;

        const selectStr = _.join(select, " ");

        const offset = currentPage * limit;

        const whereStr = _.reduce(
            where,
            (res: any[], value: any, key: any) => {
                if (_.isString(value)) {
                    res.push(key + ':"' + value + '"');
                } else if (_.isNumber(value)) {
                    res.push(key + ":" + value);
                }

                return res;
            },
            []
        );

        const graphql = `{
            ${from}(
                start: ${offset}
                limit: ${limit}
                where: {${whereStr.join(",")}}
                sort: "${order}"
            ) {
                items {
                    ${selectStr}
                }
                hasMore
                count
                pages
            }
        }`;

        setTimeout(async () => {
            const res = await fetch(Config.REST_HOST, "POST", {
                ie: true,
                data: encrypt({
                    query: graphql,
                }),
            });

            const { data, errors } = res;

            if (!_.isNil(errors)) {
                this.setState({
                    refreshing: false,
                });
            } else {
                const items = _.get(data, `${from}.items`, []);

                if (!_.isEmpty(items)) {
                    const { pages, count } = _.get(data, from);

                    this.setState({
                        refreshing: false,
                        pages: pages,
                        count: count || 0,
                        currentPage: currentPage + 1,
                        list: _.concat(list, items),
                    });
                } else {
                    this.setState({
                        refreshing: false,
                    });
                }
            }
        }, 300);
    };

    _requestLatest = () => {
        const { list, lastTime } = this.state;

        const { select, from, where, order, size, latest } = this.props;

        const limit = size || FETCH_LIMIT;

        const selectStr = _.join(select, " ");

        const latestWhere = {
            ...where,
            [`${latest}`]: lastTime,
        };

        const whereStr = _.reduce(
            latestWhere,
            (res: any[], value: any, key: any) => {
                if (_.isString(value)) {
                    res.push(key + ':"' + value + '"');
                } else if (_.isNumber(value)) {
                    res.push(key + ":" + value);
                }

                return res;
            },
            []
        );

        const graphql = `{
            ${from}(
                start: 0
                limit: ${limit}
                where: {${whereStr.join(",")}}
                sort: "${order}"
            ) {
                items {
                    ${selectStr}
                }
                hasMore
                count
                pages
            }
        }`;

        setTimeout(async () => {
            const res = await fetch(Config.REST_HOST, "POST", {
                ie: true,
                data: encrypt({
                    query: graphql,
                }),
            });

            const { data, errors } = res;

            if (!_.isNil(errors)) {
                this.setState({
                    refreshing: false,
                });
            } else {
                const items = _.get(data, `${from}.items`, []);

                if (!_.isEmpty(items)) {
                    if (_.isEmpty(list)) {
                        this.setState({
                            refreshing: false,
                            lastTime: now,
                            list: items,
                        });
                    } else {
                        const temp = _.map(items, (item: any) => {
                            if (_.findIndex(list, ["id", item.id]) === -1) {
                                return item;
                            }
                        });

                        this.setState({
                            refreshing: false,
                            lastTime: now,
                            list: _.concat(temp, list),
                        });
                    }
                } else {
                    this.setState({
                        refreshing: false,
                    });
                }
            }
        }, 300);
    };

    _keyExtractor = (item: any, index: number) => {
        return item.id + index;
    };

    _renderSeparator = () => {
        const { renderSeparator } = this.props;

        return renderSeparator ? renderSeparator() : null;
    };

    _renderEmptyList = () => {
        const { refreshing } = this.state;
        const { renderEmptyList } = this.props;

        return renderEmptyList ? (
            renderEmptyList()
        ) : refreshing ? null : (
            <NoResultFound />
        );
    };

    _renderHeader = () => {
        const { count } = this.state;
        const { renderHeader, itemType } = this.props;

        return renderHeader
            ? renderHeader(itemType === "delivered_delivery" ? { count } : null)
            : null;
    };

    _renderFooter = () => {
        const { refreshing, currentPage, pages } = this.state;
        const { renderFooter, itemType } = this.props;

        if (!refreshing) {
            return (
                <Div style={[Style.h_center, Style.bg_color_gray, Style.p_2]}>
                    {currentPage < pages ? (
                        <ActivityIndicator color={Style.f_color_first.color} />
                    ) : (
                        <Text
                            style={[
                                Style.f_size_11,
                                Style.f_weight_500,
                                Style.f_color_9,
                            ]}
                        >
                            {"------ " + Locales.t("end") + " ------"}
                        </Text>
                    )}
                </Div>
            );
        }

        return renderFooter ? renderFooter() : null;
    };

    _renderItem = ({ item }: { item: any }): ReactElement | null => {
        const { renderItem, itemComponent } = this.props;

        if (renderItem) {
            return renderItem(item);
        } else {
            if (_.has(item, "id")) {
                return itemComponent;
            } else {
                return null;
            }
        }
    };

    render() {
        const { list, refreshing } = this.state;

        return (
            <FlatList
                {...this.props}
                refreshing={refreshing}
                data={list}
                onRefresh={this._onRefresh}
                keyExtractor={this._keyExtractor}
                ListEmptyComponent={this._renderEmptyList}
                ItemSeparatorComponent={this._renderSeparator}
                ListHeaderComponent={this._renderHeader}
                ListFooterComponent={this._renderFooter}
                renderItem={this._renderItem}
                horizontal={false}
                initialScrollIndex={0}
                inverted={false}
                onEndReached={this._endReached}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                style={[]}
            />
        );
    }
}

export default FlatListViewWithGraphql;
