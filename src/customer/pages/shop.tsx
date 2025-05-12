import React, { FC, useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Div from "components/div";
import Loading from "components/loading";
import NoResultFound from "components/no-result";
import SafeAreaView from "components/safe-area-view";

import Style from "style";

import { FOOTER_BAR_HEIGHT } from "config/constant";

import { Router } from "interfaces/router";
import { SHOP_HOME } from "graphql/query";
import { enterShopHistory } from "helpers/parse";
import { redirectToShop } from "utils/navigation";

import { getMerchant } from "customer/request/shop";

import FooterBar from "customer/layout/footer-bar";
import HomePage from "customer/containers/shop/home";
import ExplorePage from "customer/containers/shop/explore";
import CartPage from "customer/containers/shop/cart";
import ProfilePage from "customer/containers/shop/profile";
import SearchPage from "customer/containers/shop/search";
import PaymentPage from "customer/containers/shop/payment";

type Props = {
    [key: string]: any;
};

const ShopPage: FC<Props> = (props) => {
    const {
        user,
        navigation,
        system: { config },
    } = props;

    const isLoggedIn = _.has(user, "id") && !!_.get(user, "id");

    const progresses = [
        "home",
        "explore",
        "cart",
        "profile",
        "search",
        "payment",
    ];

    const checkoutMode = _.get(config, "miniCheckoutMode", "full");

    const tabs = ["home", "explore", "cart", "profile"];

    const params = _.get(props, "route.params", {});

    const [shop, setShop] = useState<any>({});
    const [router, setRouter] = useState({ route: "home" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const progress = _.toLower(_.get(params, "tab", "home"));
        const route = _.includes(progresses, progress) ? progress : "home";
        route !== router.route && setRouter({ route });
    }, [params]);

    const init = async () => {
        const id = _.get(params, "id", "");

        try {
            if (id !== "") {
                const { data, errors } = await getMerchant({
                    query: SHOP_HOME,
                    variables: { id },
                });

                if (
                    _.isNil(errors) &&
                    !_.isEmpty(_.get(data, "merchant", {}))
                ) {
                    setShop(data);

                    await enterShopHistory(
                        data.merchant,
                        _.get(user, "id", "")
                    );
                }
            }
        } catch (e) {}

        setLoading(false);
    };

    useEffect(() => {
        init();
    }, []);

    const changeRouter = (router: Router) => {
        setRouter(router);
    };

    const renderView = () => {
        if (_.isEmpty(shop)) {
            return (
                <Div style={[Style.v_center, Style.h_100]}>
                    <NoResultFound />
                </Div>
            );
        }

        let component: any = null;

        switch (router.route) {
            case "home":
                component = (
                    <HomePage
                        {...params}
                        shop={shop}
                        changeRouter={changeRouter}
                        navigation={navigation}
                    />
                );
                break;

            case "explore":
                component = (
                    <ExplorePage
                        {...params}
                        shop={shop}
                        changeRouter={changeRouter}
                        navigation={navigation}
                    />
                );
                break;

            case "cart":
                component = <CartPage {...params} shop={shop.merchant} />;
                break;

            case "profile":
                component = (
                    <ProfilePage
                        {...params}
                        shop={shop.merchant}
                        router={router}
                        changeRouter={changeRouter}
                    />
                );
                break;

            case "search":
                component = (
                    <SearchPage
                        {...params}
                        shop={shop.merchant}
                        router={router}
                        changeRouter={changeRouter}
                    />
                );
                break;

            case "payment":
                component = (
                    <PaymentPage
                        {...params}
                        callback={() =>
                            redirectToShop(
                                isLoggedIn
                                    ? {
                                          id: shop.merchant.id,
                                          tab: "profile",
                                          sub_tab: "order",
                                      }
                                    : { id: shop.merchant.id, tab: "home" }
                            )
                        }
                    />
                );
                break;
        }

        return component;
    };

    return loading ? (
        <Loading />
    ) : (
        <SafeAreaView edges={["left", "right", "top"]}>
            <Div
                style={[
                    _.includes(tabs, router.route) && {
                        paddingBottom: FOOTER_BAR_HEIGHT,
                    },
                ]}
            >
                {renderView()}
            </Div>
            {checkoutMode === "full" && (
                <Div>
                    {_.includes(tabs, router.route) && (
                        <FooterBar
                            {...props}
                            router={router}
                            changeRouter={changeRouter}
                        />
                    )}
                </Div>
            )}
        </SafeAreaView>
    );
};

const mapStateToProps = (state: any) => {
    return {
        user: state.profile.user,
        system: state.system,
    };
};

export default connect(mapStateToProps)(ShopPage);
