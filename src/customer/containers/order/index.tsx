import React, { useState, useEffect, FC } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { Order } from "interfaces/cart";

import Config from "config";
import { FETCH_LIMIT, SEARCH_BAR_HEIGHT } from "config/constant";

import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

import Div from "components/div";
import Button from "components/button";
import Scroll from "components/scroll";
import Loading from "components/loading";
import NoResultFound from "components/no-result";
import ErrorMessage from "components/error-message";

import OrderItem from "./item";

import Style from "style";

type Props = {
    [key: string]: any;
};

const MyOrder: FC<Props> = (props) => {
    const { account, shop } = props;

    const [loading, changeLoading] = useState(true);
    const [refreshing, changeRefreshing] = useState(true);
    const [currentPage, changeCurrentPage] = useState(0);
    const [list, changeList] = useState([]);
    const [hasMore, changeHasMore] = useState(true);
    const [errors, changeErrors] = useState([]);

    const requestData = () => {
        changeRefreshing(true);

        const selectStr = `
            id
            serial
            items
            currency
            createdAt
            shippingType
            payment {
                amount
            }
            merchant {
                name
                logo {
                    url
                }
                region {
                    timezone
                }
            }
        `;

        const from = "moreOrders";

        const limit = FETCH_LIMIT;

        const offset = currentPage * limit;

        let where: any = { account: account.id };

        if (!_.isNil(shop) && _.has(shop, "id")) {
            where = {
                ...where,
                merchant: shop.id,
            };
        }

        const whereStr = _.reduce(
            where,
            (res: any[], value: any, key: string) => {
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
                sort: "createdAt:desc"
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
            const res = await fetch(Config.REST_HOST!, "POST", {
                ie: true,
                data: encrypt({
                    query: graphql,
                }),
            });

            const { data, errors } = res;

            if (!_.isNil(errors)) {
                changeErrors(errors);
                changeRefreshing(false);
            } else {
                const { items, hasMore } = _.get(data, from);

                changeHasMore(hasMore);

                if (!_.isEmpty(items)) {
                    changeCurrentPage(currentPage + 1);
                    changeList(_.concat(list, items));
                    changeRefreshing(false);
                } else {
                    changeRefreshing(false);
                }
            }

            changeLoading(false);
        }, 300);
    };

    useEffect(() => {
        requestData();
    }, []);

    if (loading) {
        return (
            <Div style={[Style.v_center, Style.h_p100]}>
                <Loading size={Style.f_size_30.fontSize} />
            </Div>
        );
    }

    if (!_.isEmpty(errors)) {
        return (
            <Div
                style={[
                    Style.column,
                    Style.row_center,
                    Style.column_start,
                    {
                        paddingTop: SEARCH_BAR_HEIGHT + 20,
                    },
                ]}
            >
                {_.map(errors, (error: any, index: number) => (
                    <ErrorMessage key={index} message={error.message} />
                ))}
            </Div>
        );
    }

    if (_.isEmpty(list)) {
        return (
            <Div style={[Style.v_center, Style.h_p100]}>
                <NoResultFound />
            </Div>
        );
    }

    return (
        <Scroll
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            contentContainerStyle={[Style.bg_color_15, Style.p_1]}
        >
            {_.map(list, (order: Order, index: number) => (
                <Div key={index} style={[Style.m_t_1, Style.p_1]}>
                    <OrderItem item={order} />
                </Div>
            ))}
            <Button
                size="small"
                trans="loadMoreBtn"
                onPress={requestData}
                loading={refreshing}
                disabled={!hasMore}
                style={[Style.m_v_4, Style.p_2]}
            />
        </Scroll>
    );
};

const mapStateToProps = (state: any) => {
    return {
        account: state.profile.account,
    };
};

export default connect(mapStateToProps)(MyOrder);
