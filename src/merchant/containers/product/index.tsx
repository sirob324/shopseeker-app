import React, { useState } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Select from "components/select";
import GraphqlFlatList from "components/flat-list/graphql";

import { trans } from "locales";

import Style from "style";

import { redirectToProductAdd } from "utils/navigation";

import CurrencyModel from "model/currency";

import { Nav } from "interfaces/nav";

import ProductItem from "./item";

import { useMerchant } from "merchant/contexts/app";

const ProductPage = () => {
    const { merchant } = useMerchant();

    const [category, setCategory] = useState("");

    const [popup, setPopup] = useState(false);
    const [sort, changeSort] = useState("createdAt:desc");

    const [newProduct, setNewProduct] = useState<any>(null);

    const headerRight = (
        <Div style={[Style.row, Style.column_center, Style.p_v_1]}>
            <A
                style={[Style.h_center, Style.p_h_2, Style.p_v_1]}
                onPress={() => {
                    changeSort("price:asc");
                    setPopup(!popup);
                }}
            >
                <Text style={[Style.f_size_13, Style.f_weight_500]}>
                    {trans("priceLTH")}
                </Text>
            </A>
            <A
                style={[Style.h_center, Style.p_h_2, Style.p_v_1]}
                onPress={() => {
                    changeSort("price:desc");
                    setPopup(!popup);
                }}
            >
                <Text style={[Style.f_size_13, Style.f_weight_500]}>
                    {trans("priceHTL")}
                </Text>
            </A>
        </Div>
    );

    const where: { [key: string]: any } = {
        merchant: merchant.id,
    };

    if (category) {
        _.set(where, "category", category);
    } else {
        delete where.category;
    }

    const symbol = _.get(
        CurrencyModel,
        `country.${_.toUpper(merchant.region.country)}.symbol`
    );

    const categoriesOptions = _.reduce(
        _.get(merchant, "categories", []),
        (res: any[], category: Nav) => {
            res.push({
                value: category.id,
                label: category.title,
            });

            return res;
        },
        [
            {
                value: "",
                label: trans("input_category"),
            },
        ]
    );

    const addProduct = (product: any) => {
        setNewProduct({
            type: "add",
            payload: product,
        });
    };

    const changeProduct = (product: any) => {
        setNewProduct({
            type: "change",
            payload: product,
        });
    };

    return (
        <Div style={[Style.column, Style.row_center, Style.h_p100]}>
            <Div
                style={[
                    Style.column,
                    Style.row_center,
                    Style.bg_color_15,
                    Style.shadow_bottom,
                    Style.p_h_2,
                    Style.m_b_1,
                ]}
            >
                <Div style={[Style.row, Style.row_center, Style.p_v_1]}>
                    <Select
                        options={categoriesOptions}
                        onChange={(value: any) => setCategory(value)}
                        value={category}
                    />
                </Div>
                {headerRight}
            </Div>

            <GraphqlFlatList
                numColumns={2}
                reloadToken={[category, sort]}
                select={[
                    "id",
                    "hasTax",
                    "sequence",
                    "title",
                    "measure",
                    "measureUnit",
                    "price",
                    "salePrice",
                    "description",
                    "sales",
                    "inventory",
                    "inventoryWarning",
                    "image{id name url formats}",
                    "gallery{id name url}",
                    "type{id title}",
                    "category{id title}",
                ]}
                from="moreProducts"
                where={where}
                order={sort}
                latest="createdAt_gt"
                renderItem={(item: any) => {
                    return (
                        <Div key={item.id} style={[Style.w_p50]}>
                            <ProductItem
                                item={item}
                                currency={symbol}
                                callback={changeProduct}
                            />
                        </Div>
                    );
                }}
                itemType="merchant_products"
                newItem={newProduct}
            />

            <A
                onPress={() =>
                    redirectToProductAdd({
                        callback: addProduct,
                    })
                }
                style={[
                    Style.v_center,
                    Style.bg_color_15,
                    Style.shadow,
                    Style.bottom_right,
                    {
                        right: 20,
                        bottom: 20,
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                    },
                ]}
            >
                <Icon
                    name="add"
                    size={Style.f_size_30.fontSize}
                    color={Style.f_color_primary.color}
                />
            </A>
        </Div>
    );
};

export default ProductPage;
