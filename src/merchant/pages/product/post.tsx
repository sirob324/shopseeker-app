import React, { useState, useEffect } from "react";
import _ from "lodash";
import Strapi from "strapi-sdk-javascript";

import MeasureUnitModel from "model/measure";

import { Nav } from "interfaces/nav";

import Config from "config";
import { DEVICE_WIDTH } from "config/constant";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Input from "components/input";
import Scroll from "components/scroll";
import Select from "components/select";
import Loading from "components/loading";
import Checkbox from "components/checkbox";
import Uploader from "components/uploader";
import MaskedInput from "components/masked-input";

import Lib from "helpers/lib";
import { getToken } from "helpers/profile";
import { useMutation } from "helpers/apollo";

import Locales from "locales";

import Style from "style";

import Model from "merchant/model";

import { useMerchant } from "merchant/contexts/app";

import { PRODUCT_DETAIL_WITH_FETCH } from "merchant/graphql/query";
import { ADD_PRODUCT, UPDATE_PRODUCT } from "merchant/graphql/mutation";

import { removeProductImage, getProduct } from "merchant/request";

const ProductPost = (props: any) => {
    const { merchant } = useMerchant();

    const { route, navigation } = props;

    const { item: _data, callback } = route.params;

    // check product edit or add, then use different handle
    const isAdd =
        !_.isNil(_data) &&
        _.isPlainObject(_data) &&
        !_.isEmpty(_data) &&
        _.get(_data, "id", "") !== ""
            ? false
            : true;

    // check merchant id, merchant type id, merchant region id, merchant region country
    const merchantId = _.get(merchant, "id");
    const regionId = _.get(merchant, "region.id");
    const typeId = _.get(merchant, "type.id");

    const country = _.toUpper(_.get(merchant, "region.country", ""));

    if (!!!merchantId || !!!regionId || !!!country || !!!typeId) {
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
                    The region you business registed was not opened, please
                    contact with: {Config.SUPPORT_EMAIL}
                </Text>
            </Div>
        );
    }

    // check product model
    const attrs: { [key: string]: any } = _.get(Model, `product.${country}`);
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
                    The region you business registed was not opened, please
                    contact with: {Config.SUPPORT_EMAIL}
                </Text>
            </Div>
        );
    }

    // post handler
    const [productRequestHander, { loading, error }] = useMutation(
        isAdd ? ADD_PRODUCT : UPDATE_PRODUCT
    );

    const [data, setData] = useState({});

    // set _items, _showItems, _requiredItems, showItems when is add
    const [items, setItems] = useState({});
    const [showItems, setShowItems] = useState({});
    const [stableItems, setStableItems] = useState({});
    const [requiredItems, setRequiredItems] = useState({});

    const [imageId, setImageId] = useState<string | null>(null);
    const [galleryIds, setGalleryIds] = useState<[]>([]);
    const [waitingForUpload, setWaitingForUpload] = useState([]);

    // set _items, _showItems, _requiredItems, showItems base on product request
    useEffect(() => {
        if (!isAdd && _.isEmpty(items)) {
            (async () => {
                const { data, errors } = await getProduct({
                    query: PRODUCT_DETAIL_WITH_FETCH,
                    variables: { id: _data.id },
                });

                if (
                    _.isNil(errors) &&
                    !_.isNil(data) &&
                    _.has(data, "product")
                ) {
                    const _data = data.product;

                    // combine image and gallery
                    let allImages: any = [];

                    if (
                        _.isPlainObject(_.get(_data, "image")) &&
                        _.has(_data, "image.id")
                    ) {
                        allImages.push({
                            ..._.get(_data, "image"),
                            cover: true,
                        });

                        setImageId(_.get(_data, "image.id"));
                    }

                    if (
                        _.isArray(_.get(_data, "gallery")) &&
                        !_.isEmpty(_data, "gallery")
                    ) {
                        const galleryIds = _.map(
                            _.get(_data, "gallery"),
                            (image: any) => {
                                allImages.push({
                                    ...image,
                                    cover: false,
                                });

                                return image.id;
                            }
                        );

                        setGalleryIds(galleryIds);
                    }

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

                        if (name === "category") {
                            if (
                                _.isPlainObject(_.get(_data, "category")) &&
                                _.has(_data, "category.id")
                            ) {
                                _items["category"] = _.get(
                                    _data,
                                    "category.id"
                                );
                            } else {
                                _items["category"] = defaultValue;
                            }
                        } else if (name === "gallery") {
                            _items["gallery"] = allImages;
                        } else {
                            _items[name] = defaultValue;
                        }

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

    const uploadFile = (value: any) => {
        setWaitingForUpload(value);

        onChange("gallery", value);
    };

    const deleteFile = async (file: any) => {
        if (_.has(file, "id")) {
            try {
                const res = await removeProductImage({
                    merchantId,
                    productId: _.get(data, "id", ""),
                    fileId: _.get(file, "id", ""),
                });

                if (_.get(res, "status") === "succeeded") {
                    const isCover = _.get(file, "cover", false) === true;

                    if (isCover) {
                        setImageId(null);
                    } else {
                        setGalleryIds(
                            _.filter(galleryIds, (id) => id !== file.id && id)
                        );
                    }
                }
            } catch (e) {
                sendRequestFail(e.message);
            }
        }
    };

    const changeCover = (value: any) => {
        setGalleryIds(
            _.filter(
                [...galleryIds, imageId, value],
                (id: any) => value !== id && id
            )
        );

        setImageId(value);

        onChange("image", value);
    };

    const setHeaderBar = () => {
        let canPost = _.isEqual(stableItems, items) ? false : true;

        if (canPost) {
            for (var itemName in requiredItems) {
                const _value = getItem(itemName);

                if (
                    _.isNil(_value) ||
                    (itemName === "gallery" && _.isEmpty(_value)) ||
                    !_value
                ) {
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

    const preSendRequest = async (files: any) => {
        let data: any = [];

        const strapi = new Strapi(Config.HOST as string);

        if (!_.isEmpty(files)) {
            const form = new FormData();
            files.map((file: any) => {
                form.append("files", {
                    uri: file.path,
                    type: file.type,
                    name: file.name,
                });
            });

            try {
                const token = await getToken();
                const headers = {};

                if (token) {
                    _.set(headers, "Authorization", "Bearer " + token);
                }

                const res: any = await strapi.upload(form, {
                    headers: headers,
                });

                if (_.isArray(res)) {
                    if (res.length === 1) {
                        const fileId = _.get(res, "0.id", "");
                        if (fileId) {
                            data = [_.pick(res[0], ["id", "name", "url"])];
                        }
                    } else if (res.length > 1) {
                        let fileIds: string[] = [];

                        _.forEach(res, (file: any) => {
                            const fileId: string = _.get(file, "id", "");

                            if (fileId) {
                                fileIds.push(
                                    _.pick(file, ["id", "name", "url"])
                                );
                            }
                        });

                        if (!_.isEmpty(fileIds)) {
                            data = fileIds;
                        }
                    }
                }
            } catch (e) {
                data = [];
            }
        }

        return data;
    };

    const sendRequest = async () => {
        let requestData: any = {
            ...items,
            region: regionId,
            type: typeId,
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

        let _imageId: any = null;

        let _galleryIds: any = [];

        if (!_.isEmpty(waitingForUpload)) {
            const cover = _.find(waitingForUpload, ["cover", true]);

            const res = await preSendRequest(waitingForUpload);

            if (!_.isEmpty(res)) {
                _.map(res, (image: any) => {
                    if (
                        !_.isNil(cover) &&
                        _.isEqual(_.get(cover, "name"), _.get(image, "name"))
                    ) {
                        _imageId = image.id;
                    } else {
                        _galleryIds.push(image.id);
                    }
                });
            }
        }

        requestData = {
            ...requestData,
            gallery: _.isEmpty(galleryIds) ? [] : galleryIds,
        };

        if (!_.isEmpty(_galleryIds)) {
            requestData = {
                ...requestData,
                gallery: _.uniq([..._galleryIds, ...requestData.gallery]),
            };
        }

        requestData = {
            ...requestData,
            image: imageId || null,
        };

        if (_imageId) {
            requestData = {
                ...requestData,
                image: _imageId,
                gallery: _.uniq([...requestData.gallery, imageId]),
            };
        }

        const variables = {
            data: requestData,
        };

        if (!isAdd) {
            _.set(variables, "id", _.get(data, "id"));
        }

        const res = await productRequestHander({ variables });

        if (_.has(res, "data") && !_.isEmpty(res.data)) {
            sendRequestSuccess(() => {
                navigation.goBack();

                callback &&
                    callback(
                        _.get(
                            res,
                            `data.${
                                isAdd ? "createProduct" : "updateProduct"
                            }.product`
                        )
                    );
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
                    mask,
                    format,
                    label_trans,
                    label,
                    note_trans,
                    note,
                    disabled,
                    required,
                    multiple,
                    maxFiles,
                    choices,
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
                    case "file":
                        input = (
                            <Uploader
                                width={DEVICE_WIDTH / 2 - 15}
                                height={DEVICE_WIDTH / 2 - 15}
                                value={getItem(name)}
                                format={format}
                                multiple={multiple}
                                maxFiles={maxFiles || 1}
                                uploadFile={(value: any) => uploadFile(value)}
                                deleteFile={(value: any) => deleteFile(value)}
                                changeCover={(value: string) =>
                                    changeCover(value)
                                }
                            />
                        );
                        break;

                    case "choices":
                        let options = !_.isNil(choices)
                            ? _.reduce(
                                  choices,
                                  (res: any[], value: string, key: string) => {
                                      res.push({
                                          value: key,
                                          label: value,
                                      });

                                      return res;
                                  },
                                  []
                              )
                            : null;

                        if (name === "category") {
                            options = _.reduce(
                                _.get(merchant, "categories", []),
                                (res: any[], category: Nav) => {
                                    res.push({
                                        value: category.id,
                                        label: category.title,
                                    });

                                    return res;
                                },
                                []
                            );
                        } else if (name === "measureUnit") {
                            options = _.reduce(
                                MeasureUnitModel,
                                (res: any[], unit: string) => {
                                    res.push({
                                        value: unit,
                                        label: Locales.t(
                                            `measure_unit_${unit}`
                                        ),
                                    });

                                    return res;
                                },
                                []
                            );
                        } else if (name === "status") {
                            options = _.reduce(
                                ["online", "offline"],
                                (res: any[], status: string) => {
                                    res.push({
                                        value: status,
                                        label: Locales.t(`status_${status}`),
                                    });

                                    return res;
                                },
                                []
                            );
                        }

                        input = (
                            <Select
                                value={getItem(name)}
                                options={options}
                                onChange={(value: any) => {
                                    onChange(name, value);
                                }}
                                placeholder={_placeholder}
                                disabled={disabled}
                                multiple={multiple}
                            />
                        );
                        break;

                    case "mask":
                        input = (
                            <Div
                                style={[
                                    Style.w_p100,
                                    Style.row,
                                    Style.row_start,
                                    Style.column_start,
                                    Style.bg_color_light,
                                    Style.border_round_1,
                                ]}
                            >
                                <MaskedInput
                                    value={getItem(name)}
                                    onChange={(value: any) => {
                                        onChange(name, value);
                                    }}
                                    mask={mask}
                                    placeholder={_placeholder}
                                />
                            </Div>
                        );
                        break;

                    case "textarea":
                        input = (
                            <Input
                                value={getItem(name)}
                                placeholder={_placeholder}
                                textAlignVertical="top"
                                editable={true}
                                autoFocus={false}
                                onChange={(value: any) => {
                                    onChange(name, value);
                                }}
                                multiline={true}
                                style={[
                                    Style.p_2,
                                    {
                                        height: 100,
                                    },
                                ]}
                            />
                        );
                        break;

                    case "checkbox":
                        input = (
                            <Checkbox
                                value={getItem(name)}
                                onChange={(value: any) => {
                                    onChange(name, value);
                                }}
                            />
                        );
                        break;

                    case "number":
                        input = (
                            <Input
                                type="decimal-pad"
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

                    case "email":
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

export default ProductPost;
