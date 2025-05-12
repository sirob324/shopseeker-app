import React, { useEffect } from "react";
import _ from "lodash";
import { Alert } from "react-native";

import Lib from "helpers/lib";
import { useQuery, useMutation } from "helpers/apollo";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Scroll from "components/scroll";

import { trans } from "locales";

import Style from "style";

import {
    redirectToCategoryAdd,
    redirectToCategoryUpdate,
} from "utils/navigation";

import { CATEGORIES } from "merchant/graphql/query";
import { DELETE_CATEGORY } from "merchant/graphql/mutation";

import { useMerchant } from "merchant/contexts/app";

const CategoryPage = () => {
    const { merchant, updateMerchant } = useMerchant();

    const where: { [key: string]: any } = {
        merchant: merchant.id,
    };

    const condition = {
        sort: "sequence:desc",
        where,
    };

    const { data, error, refetch } = useQuery(CATEGORIES, condition);

    const [deleteCategory] = useMutation(DELETE_CATEGORY);

    useEffect(() => {
        if (
            data &&
            _.has(data, "categories") &&
            !_.isEqual(merchant.categories, data.categories)
        ) {
            updateMerchant({ id: merchant.id, categories: data.categories });
        }
    }, [data]);

    const reloadPage = () => {
        refetch();
    };

    return (
        <Div style={[Style.column, Style.h_p100]}>
            <Div
                style={[
                    Style.position_absolute,
                    Style.w_p100,
                    Style.row,
                    Style.column_center,
                    Style.bg_color_15,
                    Style.shadow_bottom,
                ]}
            >
                <Div style={[Style.v_center, Style.w_p20, Style.p_v_2]}>
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {trans("input_sequence")}
                    </Text>
                </Div>
                <Div style={[Style.v_center, Style.w_p60, Style.p_v_2]}>
                    <Text style={[Style.f_size_13, Style.f_weight_500]}>
                        {trans("input_title")}
                    </Text>
                </Div>
                <Div style={[Style.h_center, Style.w_p20, Style.p_v_2]}></Div>
            </Div>

            {error ? (
                <Div style={[Style.p_3]}>
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_danger,
                            Style.f_weight_500,
                        ]}
                    >
                        {error.message}
                    </Text>
                </Div>
            ) : (
                <Scroll contentContainerStyle={[Style.m_t_8]}>
                    {_.map(
                        _.get(data, "categories"),
                        (category: any, index: number) => (
                            <Div
                                key={index}
                                style={[
                                    Style.w_p100,
                                    Style.row,
                                    Style.column_center,
                                    Style.bg_color_15,
                                    Style.b_b_light,
                                    Style.p_v_2,
                                ]}
                            >
                                <Div
                                    style={[
                                        Style.v_center,
                                        Style.w_p20,
                                        Style.p_v_2,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_500,
                                        ]}
                                    >
                                        {category.sequence}
                                    </Text>
                                </Div>
                                <Div
                                    style={[
                                        Style.v_center,
                                        Style.w_p60,
                                        Style.p_v_2,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_500,
                                        ]}
                                    >
                                        {category.title}
                                    </Text>
                                </Div>
                                <Div style={[Style.h_center, Style.w_p20]}>
                                    <A
                                        onPress={() =>
                                            redirectToCategoryUpdate({
                                                item: category,
                                                callback: reloadPage,
                                            })
                                        }
                                    >
                                        <Icon
                                            name="edit"
                                            size={Style.f_size_20.fontSize}
                                            color={Style.f_color_dark.color}
                                        />
                                    </A>
                                    <A
                                        onPress={() => {
                                            Alert.alert(
                                                trans("areYouSure"),
                                                undefined,
                                                [
                                                    {
                                                        text: trans("no"),
                                                        style: "cancel",
                                                    },
                                                    {
                                                        text: trans("yes"),
                                                        onPress: async () => {
                                                            const res =
                                                                await deleteCategory(
                                                                    {
                                                                        variables:
                                                                            {
                                                                                id: category.id,
                                                                            },
                                                                    }
                                                                );

                                                            if (
                                                                _.has(
                                                                    res,
                                                                    "data"
                                                                ) &&
                                                                !_.isEmpty(
                                                                    res.data
                                                                )
                                                            ) {
                                                                Lib.showToast(
                                                                    trans(
                                                                        "succeeded"
                                                                    ),
                                                                    {
                                                                        onClose:
                                                                            refetch,
                                                                        style: {
                                                                            ...Style.bg_color_success,
                                                                        },
                                                                        textStyle:
                                                                            {
                                                                                ...Style.f_color_15,
                                                                            },
                                                                    }
                                                                );
                                                            } else {
                                                                Lib.showToast(
                                                                    trans(
                                                                        "failed"
                                                                    ),
                                                                    {
                                                                        onClose:
                                                                            refetch,
                                                                        style: {
                                                                            ...Style.bg_color_danger,
                                                                        },
                                                                        textStyle:
                                                                            {
                                                                                ...Style.f_color_15,
                                                                            },
                                                                    }
                                                                );
                                                            }
                                                        },
                                                    },
                                                ],
                                                {
                                                    cancelable: true,
                                                }
                                            );
                                        }}
                                        style={{ ...Style.m_l_4 }}
                                    >
                                        <Icon
                                            name="trash-outline"
                                            size={Style.f_size_20.fontSize}
                                            color={Style.f_color_dark.color}
                                        />
                                    </A>
                                </Div>
                            </Div>
                        )
                    )}
                </Scroll>
            )}

            <A
                onPress={() =>
                    redirectToCategoryAdd({
                        callback: reloadPage,
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

export default CategoryPage;
