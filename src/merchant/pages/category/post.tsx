import React, { useState, useEffect } from "react";
import _ from "lodash";

import Config from "config";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Input from "components/input";
import Scroll from "components/scroll";
import Loading from "components/loading";

import Lib from "helpers/lib";
import { useMutation } from "helpers/apollo";

import Locales from "locales";

import Style from "style";

import Model from "merchant/model";

import { useMerchant } from "merchant/contexts/app";

import { CATEGORY_DETAIL_WITH_FETCH } from "merchant/graphql/query";
import { ADD_CATEGORY, UPDATE_CATEGORY } from "merchant/graphql/mutation";

import { getCategory } from "merchant/request";

const CategoryPost = (props: any) => {
    const { merchant } = useMerchant();

    const { route, navigation } = props;

    const { item: _data, callback } = route.params;

    // check category edit or add, then use different handle
    const isAdd =
        !_.isNil(_data) &&
        _.isPlainObject(_data) &&
        !_.isEmpty(_data) &&
        _.get(_data, "id", "") !== ""
            ? false
            : true;

    // check merchant id
    const merchantId = _.get(merchant, "id");

    const country = _.toUpper(_.get(merchant, "region.country", ""));

    if (!!!merchantId || !!!country) {
        return (
            <Div
                style={[
                    Style.w_p100,
                    Style.h_p100,
                    Style.column,
                    Style.row_center,
                ]}
            >
                <Text style={[Style.f_color_danger]}>
                    We can't get merchant information, please contact with:{" "}
                    {Config.SUPPORT_EMAIL}
                </Text>
            </Div>
        );
    }

    // check product model
    const attrs: any = _.get(Model, `category.${country}`);
    if (_.isEmpty(attrs)) {
        return (
            <Div
                style={[
                    Style.w_p100,
                    Style.h_p100,
                    Style.column,
                    Style.row_center,
                ]}
            >
                <Text style={[Style.f_color_danger]}>
                    We can't get merchant information, please contact with:{" "}
                    {Config.SUPPORT_EMAIL}
                </Text>
            </Div>
        );
    }

    // post handler
    const [categoryRequestHander, { loading, error }] = useMutation(
        isAdd ? ADD_CATEGORY : UPDATE_CATEGORY
    );

    const [data, setData] = useState({});

    // set _items, _showItems, _requiredItems, showItems when is add
    const [items, setItems] = useState({});
    const [showItems, setShowItems] = useState({});
    const [stableItems, setStableItems] = useState({});
    const [requiredItems, setRequiredItems] = useState({});

    // set _items, _showItems, _requiredItems, showItems base on product request
    useEffect(() => {
        if (!isAdd && _.isEmpty(items)) {
            (async () => {
                const { data, errors } = await getCategory({
                    query: CATEGORY_DETAIL_WITH_FETCH,
                    variables: { id: _data.id },
                });

                if (
                    _.isNil(errors) &&
                    !_.isNil(data) &&
                    _.has(data, "category")
                ) {
                    const _data = data.category;

                    let _items: { [key: string]: any } = {};
                    let _showItems: { [key: string]: any } = {};
                    let _requiredItems: { [key: string]: any } = {};

                    for (let name in attrs) {
                        const { value, required, show } = attrs[name];

                        const defaultValue =
                            _.get(_data, name) !== undefined
                                ? _.get(_data, name)
                                : !_.isNil(value) && value
                                ? value
                                : null;

                        _items[name] = defaultValue;

                        _showItems[name] = show === false ? false : true;

                        if (required === true) {
                            _requiredItems[name] = true;
                        }
                    }

                    setData(_data);

                    setItems(_items);
                    setStableItems(_items);
                    setRequiredItems(_requiredItems);
                    setShowItems(_showItems);
                }
            })();
        }

        if (isAdd && _.isEmpty(items)) {
            let _items: { [key: string]: any } = {};
            let _showItems: { [key: string]: any } = {};
            let _requiredItems: { [key: string]: any } = {};

            for (let name in attrs) {
                const { value, required, show } = attrs[name];

                _items[name] = value !== undefined ? value : null;

                _showItems[name] = show === false ? false : true;

                if (required === true) {
                    _requiredItems[name] = true;
                }
            }

            setRequiredItems(_requiredItems);
            setShowItems(_showItems);
            setStableItems(_items);
            setItems(_items);
        }
    }, []);

    useEffect(() => {
        setHeaderBar();
    }, [items, stableItems]);

    const getItem = (name: string) => {
        return _.get(items, name);
    };

    const onChange = (name: string, value: any) => {
        setItems({
            ...items,
            [name]: value,
        });
    };

    const setHeaderBar = () => {
        let canPost = _.isEqual(stableItems, items) ? false : true;

        if (canPost) {
            for (var itemName in requiredItems) {
                const _value = getItem(itemName);

                if (_.isNil(_value) || !_value) {
                    canPost = false;
                    break;
                }
            }
        }

        let headerRight: any = null;

        if (canPost) {
            headerRight = (
                <A onPress={sendRequest}>
                    <Text
                        style={[
                            Style.border_round_1,
                            Style.p_h_2,
                            Style.p_v_1,
                            Style.bg_color_primary,
                            Style.f_color_15,
                            Style.overflow_hidden,
                        ]}
                    >
                        {Locales.t(isAdd ? "add" : "save")}
                    </Text>
                </A>
            );
        } else {
            headerRight = (
                <Text
                    style={[
                        Style.f_color_10,
                        Style.b,
                        Style.p_h_2,
                        Style.p_v_1,
                        Style.border_round_1,
                    ]}
                >
                    {Locales.t(isAdd ? "add" : "save")}
                </Text>
            );
        }

        navigation.setOptions({
            headerRight: () => <Div style={[Style.m_r_1]}>{headerRight}</Div>,
        });
    };

    const sendRequest = async () => {
        let requestData: any = {
            ...items,
            merchant: merchantId,
        };

        if (loading) {
            navigation.setOptions({
                headerRight: () => <Loading />,
            });
        }

        if (error) {
            sendRequestFail(error.message);
        }

        const variables = {
            data: requestData,
        };

        if (!isAdd) {
            _.set(variables, "id", _.get(data, "id"));
        }

        const res = await categoryRequestHander({ variables });

        if (_.has(res, "data") && !_.isEmpty(res.data)) {
            sendRequestSuccess(() => {
                navigation.goBack();

                callback && callback();
            });
        } else {
            sendRequestFail("", () => navigation.goBack());
        }
    };

    const sendRequestSuccess = (callback: any = null) => {
        Lib.showToast(Locales.t("succeeded"), {
            onClose: callback,
            style: {
                ...Style.bg_color_success,
            },
            textStyle: {
                ...Style.f_color_15,
            },
        });
    };

    const sendRequestFail = (message: string = "", callback: any = null) => {
        Lib.showToast(message === "" ? Locales.t("failed") : message, {
            onClose: callback,
            style: {
                ...Style.bg_color_danger,
            },
            textStyle: {
                ...Style.f_color_15,
            },
        });
    };

    const renderView = () => {
        const inputs =
            _.size(attrs) > 0 &&
            _.map(attrs, (attr: any, index: number) => {
                let input;

                const {
                    type,
                    name,
                    placeholder,
                    trans,
                    label_trans,
                    label,
                    note_trans,
                    note,
                    disabled,
                    required,
                    className,
                } = attr;

                const _label = !_.isNil(label_trans)
                    ? Locales.t(label_trans)
                    : !_.isNil(label)
                    ? label
                    : "";

                const _note = !_.isNil(note_trans)
                    ? Locales.t(note_trans)
                    : !_.isNil(note)
                    ? note
                    : "";

                const _placeholder = placeholder
                    ? placeholder
                    : trans
                    ? Locales.t(trans)
                    : "";

                switch (type) {
                    case "number":
                        input = (
                            <Input
                                type="number-pad"
                                value={
                                    _.isNumber(getItem(name))
                                        ? "" + getItem(name)
                                        : getItem(name)
                                }
                                placeholder={_placeholder}
                                editable={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoFocus={false}
                                onChange={(value: any) => {
                                    onChange(
                                        name,
                                        _.isNaN(value) ? 0 : _.toNumber(value)
                                    );
                                }}
                            />
                        );
                        break;

                    case "text":
                        input = (
                            <Input
                                value={getItem(name)}
                                placeholder={_placeholder}
                                editable={!disabled}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoFocus={false}
                                onChange={(value: any) => {
                                    onChange(name, value);
                                }}
                            />
                        );
                        break;
                }

                return _.get(showItems, name) === true ? (
                    <Div
                        key={index}
                        style={[
                            Style.column,
                            Style.column_start,
                            Style.row_center,
                            Style.m_b_5,
                        ]}
                        className={className || ""}
                    >
                        {!_.isEmpty(_label) && (
                            <Text
                                style={[
                                    Style.m_b_1,
                                    Style.f_size_12,
                                    Style.f_weight_500,
                                    required && Style.f_color_danger,
                                ]}
                            >
                                {_label}
                            </Text>
                        )}
                        {input}
                        {type !== "image" && !_.isEmpty(_note) && (
                            <Text
                                style={[
                                    Style.f_size_13,
                                    Style.f_color_dark,
                                    Style.m_t_1,
                                ]}
                            >
                                {_note}
                            </Text>
                        )}
                    </Div>
                ) : null;
            });

        return (
            <Scroll
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="interactive"
            >
                {inputs}
            </Scroll>
        );
    };

    return (
        <Div
            style={[
                Style.column,
                Style.w_p100,
                Style.h_p100,
                Style.bg_color_15,
                Style.p_2,
            ]}
        >
            {renderView()}
        </Div>
    );
};

export default CategoryPost;
