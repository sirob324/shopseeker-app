import React, { Component, ReactElement } from "react";
import { FlatList, FlatListProps } from "react-native";
import _ from "lodash";

import { FETCH_LIMIT } from "config/constant";

import fetch from "helpers/fetch";

interface Props {
    reloadToken: string;
    listViewToken: string;
    reloadListView: Function;
    latestListView: any;
    requestHost: string;
    size: number;
    renderSeparator?: any;
    renderEmptyList?: any;
    renderHeader?: any;
    renderFooter?: any;
    renderItem?: any;
    itemType?: string;
    itemComponent?: any;
}

interface States {
    data: any[];
    currentPage: number;
    pages: number;
    refreshing: boolean;
    lastTime: any;
}

class FlatListView extends Component<Props & FlatListProps<any>, States> {
    state = {
        data: [],
        currentPage: 0,
        pages: 0,
        refreshing: true,
        lastTime: new Date().getTime(),
    };

    componentDidMount() {
        this._requestData();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            !_.isNil(prevProps.reloadToken) &&
            !_.isNil(this.props.reloadToken) &&
            !_.isEqual(prevProps.reloadToken, this.props.reloadToken)
        ) {
            this.setState(
                {
                    data: [],
                    currentPage: 0,
                    pages: 0,
                    refreshing: true,
                    lastTime: new Date().getTime(),
                },
                () => this._requestData()
            );
        }

        if (
            !_.isNil(this.props.listViewToken) &&
            !_.isNil(this.props.reloadListView) &&
            !_.isEqual(prevProps.reloadListView, this.props.reloadListView)
        ) {
            this.setState(
                {
                    data: [],
                    currentPage: 0,
                    pages: 0,
                    refreshing: true,
                    lastTime: new Date().getTime(),
                },
                () => {
                    this.props.reloadListView(this.props.listViewToken);
                    this._requestData();
                }
            );
        }

        if (
            !_.isNil(this.props.listViewToken) &&
            !_.isNil(this.props.latestListView) &&
            !_.isEqual(prevProps.latestListView, this.props.latestListView)
        ) {
            this._onRefresh();
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

        if (pages === 0 || currentPage < pages) {
            this._requestData();
        }
    };

    _requestData = () => {
        const { currentPage, data } = this.state;

        const {
            // select,
            // where,
            // order,
            size,
            requestHost,
            // lat,
            // lng,
        } = this.props;

        const limit = size || FETCH_LIMIT;

        setTimeout(async () => {
            const res = await fetch(requestHost, "POST", {
                size: limit,
                page: currentPage + 1,
            });

            const { status, message } = res.data;

            if (parseInt(status) === 1) {
                const { list, count } = message;

                this.setState({
                    refreshing: false,
                    pages: Math.ceil(count / limit),
                    currentPage: currentPage + 1,
                    data: _.concat(data, list),
                });
            } else {
                this.setState({
                    refreshing: false,
                });
            }
        }, 300);
    };

    _requestLatest = () => {
        const { data, lastTime } = this.state;

        const { requestHost } = this.props;

        setTimeout(async () => {
            const res = await fetch(requestHost, "POST", {});

            const { status, message } = res.data;

            if (parseInt(status) === 1) {
                const { list } = message;
                this.setState({
                    refreshing: false,
                    lastTime: new Date().getTime(),
                    data: _.concat(list, data),
                });
            } else {
                this.setState({
                    refreshing: false,
                });
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
        const { renderEmptyList } = this.props;

        return renderEmptyList ? renderEmptyList() : null;
    };

    _renderHeader = () => {
        const { renderHeader } = this.props;

        return renderHeader ? renderHeader() : null;
    };

    _renderFooter = () => {
        const { renderFooter } = this.props;

        return renderFooter ? renderFooter() : null;
    };

    _renderItem = ({ item }: { item: any }): ReactElement | null => {
        if (this.props.renderItem) {
            return this.props.renderItem(item);
        } else {
            const { itemType, itemComponent } = this.props;

            if (item.id) {
                return itemComponent;
            } else {
                return null;
            }
        }
    };

    render() {
        const { data, refreshing } = this.state;

        return (
            <FlatList
                refreshing={refreshing}
                data={data}
                onRefresh={this._onRefresh}
                keyExtractor={this._keyExtractor}
                ListEmptyComponent={this._renderEmptyList}
                ItemSeparatorComponent={this._renderSeparator}
                ListHeaderComponent={this._renderHeader}
                ListFooterComponent={this._renderFooter}
                horizontal={false}
                initialScrollIndex={0}
                inverted={false}
                onEndReached={this._endReached}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                {...this.props}
                style={[]}
            />
        );
    }
}

export default FlatListView;
