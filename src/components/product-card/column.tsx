import React, { FC, useState } from "react";
import _ from "lodash";

import CurrencyModel from "model/currency";

import { DEVICE_HEIGHT, IMG_HEIGHT } from "config/constant";

import { CartItem } from "interfaces/cart";

import Div from "components/div";
import Text from "components/text";
import Image from "components/image";
import AlbumModal from "components/modal/album";

import { trans } from "locales";

import Style from "style";

interface Props {
    item: CartItem;
    style?: any[];
}

const CardColumn: FC<Props> = ({ item, style = [] }) => {
    const [showAlbumModal, setShowAlbumModal] = useState(false);

    const {
        title,
        description,
        measure,
        measureUnit,
        price,
        salePrice,
        hasTax,
        merchant,
        image,
        gallery,
    } = item;

    const currency = _.get(
        CurrencyModel,
        `code.${_.toUpper(merchant.region.currency)}.symbol`
    );

    const hasSalePrice = !_.isNil(salePrice) && _.toNumber(salePrice) > 0;

    let images = [...gallery];

    if (!_.isNil(image) && _.has(image, "url")) {
        images.unshift(image);
    }

    return (
        <Div style={[Style.column, Style.row_between, ...style]}>
            <Div
                style={[Style.v_center, Style.m_b_2, { height: IMG_HEIGHT }]}
                onClick={() => setShowAlbumModal(true)}
            >
                <Image src={_.get(image, "url", null)} />
            </Div>

            <Text
                style={[Style.f_size_13, Style.f_weight_500, { height: 40 }]}
                numberOfLines={2}
            >
                {_.isNil(hasTax) ||
                    (!hasTax && (
                        <Text
                            style={[
                                Style.f_size_10,
                                Style.f_weight_500,
                                Style.f_color_first,
                                Style.m_r_1,
                            ]}
                        >
                            {`${trans("freeTax")} `}
                        </Text>
                    ))}
                {title}
            </Text>

            {hasSalePrice && (
                <Text
                    style={[
                        Style.f_size_13,
                        Style.f_color_dark,
                        Style.linethrough,
                    ]}
                >
                    {currency}
                    {price}
                </Text>
            )}

            <Div
                style={[
                    Style.row,
                    Style.row_start,
                    Style.column_center,
                    hasSalePrice ? Style.m_t_1 : Style.m_t_5,
                ]}
            >
                <Text
                    style={[
                        Style.f_size_13,
                        Style.f_weight_500,
                        hasSalePrice
                            ? Style.f_color_first
                            : Style.f_color_primary,
                    ]}
                >
                    {currency}
                    {hasSalePrice ? salePrice : price}
                </Text>
                <Text
                    style={[
                        Style.f_size_13,
                        Style.f_weight_500,
                        Style.f_color_dark,
                        Style.m_h_1,
                    ]}
                >
                    {"/"}
                </Text>
                <Text
                    style={[
                        Style.f_size_13,
                        Style.f_weight_500,
                        Style.f_color_dark,
                    ]}
                >
                    {measure} {trans(`measure_unit_${_.toUpper(measureUnit)}`)}
                </Text>
            </Div>
            <AlbumModal
                index={0}
                data={images}
                visible={showAlbumModal}
                onCancel={() => setShowAlbumModal(false)}
                renderImage={(props: any) => {
                    return (
                        <Div style={[Style.p_8]}>
                            <Image source={props.source} />
                        </Div>
                    );
                }}
                renderHeader={() => (
                    <Div
                        style={[
                            Style.top_horizontal,
                            Style.h_center,
                            Style.p_4,
                            { top: DEVICE_HEIGHT / 5 },
                        ]}
                    >
                        <Text
                            numberOfLines={2}
                            style={[Style.f_size_15, Style.f_weight_500]}
                        >
                            {title}
                        </Text>
                    </Div>
                )}
                renderIndicator={(currentIndex: number, total: number) => (
                    <Div
                        style={[
                            Style.top_horizontal,
                            Style.v_center,
                            { top: DEVICE_HEIGHT / 7 },
                        ]}
                    >
                        <Text>{`${currentIndex} / ${total}`}</Text>
                    </Div>
                )}
                renderFooter={() => (
                    <Div
                        style={[
                            Style.bg_color_light,
                            Style.v_center,
                            Style.p_2,
                        ]}
                    >
                        <Text style={[Style.f_size_13, Style.f_weight_500]}>
                            {description}
                        </Text>
                    </Div>
                )}
                backgroundColor={Style.bg_transparent}
                footerContainerStyle={{
                    ...Style.position_absolute,
                    ...Style.bg_color_10,
                    bottom: DEVICE_HEIGHT / 11,
                }}
                style={{
                    ...Style.bg_color_15,
                }}
            />
        </Div>
    );
};

export default CardColumn;
