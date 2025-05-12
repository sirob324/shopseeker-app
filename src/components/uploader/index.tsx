import React, { FC, useState } from "react";
import _ from "lodash";
import { Platform } from "react-native";
import ImagePicker from "react-native-image-crop-picker";

import { IMG_WIDTH, IMG_HEIGHT } from "config/constant";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Image from "components/image";

import { trans } from "locales";

import Style from "style";

type Props = {
    width: any;
    height: any;
    value: any;
    format: string;
    multiple: boolean;
    maxFiles: number;
    disabled?: boolean;
    uploadFile: Function;
    deleteFile: Function;
    changeCover?: Function;
};

const Uploader: FC<Props> = ({
    width,
    height,
    value,
    multiple,
    maxFiles,
    disabled,
    uploadFile,
    deleteFile,
    changeCover,
}) => {
    const images: any = [];

    if (_.isPlainObject(value) && _.has(value, "url")) {
        images.push({
            ...value,
            new: false,
        });
    } else if (_.isArray(value)) {
        _.map(value, (image: any) => {
            if (_.isPlainObject(image) && _.has(image, "url")) {
                images.push({
                    ...image,
                    new: false,
                });
            }
        });
    }

    const [files, setFiles] = useState(images);

    const canUploadFiles = (multiple === false ? 1 : maxFiles) - _.size(files);
    const _disabled = _.toNumber(canUploadFiles) <= 0 ? true : disabled;

    const openAlbumPicker = async () => {
        const options: any =
            Platform.OS === "ios"
                ? {
                      cropping: true,
                      width,
                      height,
                      multiple,
                      includeBase64: true,
                      avoidEmptySpaceAroundImage: true,
                      freeStyleCropEnabled: true,
                      cropperToolbarTitle: trans("edit"),
                      cropperCircleOverlay: true,
                      maxFiles: maxFiles - Object.keys(files).length,
                      waitAnimationEnd: true,
                      smartAlbums: ["UserLibrary"],
                      compressImageQuality: 0.3,
                      loadingLabelText: "",
                      mediaType: "photo",
                      showsSelectedCount: true,
                      forceJpg: true,
                      // enableRotationGesture: true,
                      cropperChooseText: trans("choose"),
                      cropperCancelText: trans("cancel"),
                  }
                : {
                      cropping: true,
                      width,
                      height,
                      multiple,
                      includeBase64: true,
                      // avoidEmptySpaceAroundImage: true,
                      freeStyleCropEnabled: true,
                      cropperToolbarTitle: trans("edit"),
                      cropperCircleOverlay: true,
                      maxFiles: maxFiles - Object.keys(files).length,
                      // waitAnimationEnd: true,
                      // smartAlbums: ['UserLibrary'],
                      compressImageQuality: 0.3,
                      // loadingLabelText: '',
                      mediaType: "photo",
                      // showsSelectedCount: true,
                      // forceJpg: true,
                      enableRotationGesture: true,
                      // cropperChooseText: trans("choose"),
                      // cropperCancelText: trans("cancel")
                  };

        const images: any = await ImagePicker.openPicker(options).then(
            (images: any) => {
                return (_.isArray(images) ? images : [images]).map(
                    (image: any) => {
                        let identifier =
                            (image.creationDate || image.modificationDate) +
                            image.size;

                        return {
                            path: image.sourceURL || image.path,
                            name: image.filename || identifier,
                            type: image.mime,
                            new: true,
                            id: identifier,
                            url: `data:${image.mime};base64,${image.data}`,
                        };
                    }
                );
            }
        );

        setLocaleFiles([...files, ...images]);

        ImagePicker.clean();
    };

    const setLocaleFiles = (files: any) => {
        uploadFile(_.filter(files, (file: any) => _.get(file, "new") === true));

        setFiles(files);
    };

    const removeFile = (_file: any) => {
        setLocaleFiles(
            _.filter(files, (file: any) => !_.isEqual(file.id, _file.id))
        );

        if (_.get(_file, "new") !== true) {
            deleteFile(_file);
        }
    };

    const setCover = (file: any) => {
        setLocaleFiles(
            _.map(files, (_file: any) =>
                _.assign(_file, {
                    cover: _.isEqual(file.id, _file.id),
                })
            )
        );

        if (_.get(file, "new") !== true && _.has(file, "id")) {
            changeCover && changeCover(file.id);
        }
    };

    const renderLocalImages = () => {
        const localImages = _.map(files, (file: any, index: number) => (
            <Div
                key={index}
                style={[
                    Style.column,
                    Style.m_b_2,
                    Style.b_img,
                    Style.position_relative,
                ]}
            >
                <Div
                    style={[
                        Style.v_center,
                        {
                            width: width,
                            height: height,
                        },
                    ]}
                >
                    <Image src={file} width="100%" height="100%" />
                </Div>
                <Div
                    style={[
                        Style.w_p100,
                        Style.bottom_horizontal,
                        Style.row,
                        Style.column_center,
                        Style.row_between,
                        Style.bg_color_15_transparent_8,
                        Style.p_2,
                    ]}
                >
                    {changeCover &&
                        (_.get(file, "cover", false) === true ? (
                            <Div
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.row_start,
                                ]}
                            >
                                <Text
                                    style={[
                                        Style.f_size_13,
                                        Style.f_weight_600,
                                        Style.f_color_primary,
                                    ]}
                                >
                                    {trans("isCover")}
                                </Text>
                            </Div>
                        ) : (
                            <Div
                                style={[
                                    Style.row,
                                    Style.column_center,
                                    Style.row_start,
                                ]}
                            >
                                <A onPress={() => setCover(file)}>
                                    <Text
                                        style={[
                                            Style.f_size_13,
                                            Style.f_weight_600,
                                            Style.f_color_5,
                                        ]}
                                    >
                                        {trans("setCover")}
                                    </Text>
                                </A>
                            </Div>
                        ))}
                    <A onPress={() => removeFile(file)}>
                        <Icon
                            name="trash-outline"
                            size={Style.f_size_25.fontSize}
                            color={Style.f_color_0.color}
                        />
                    </A>
                </Div>
            </Div>
        ));

        return (
            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.wrap,
                    Style.w_p100,
                    Style.m_t_2,
                ]}
            >
                {localImages}
            </Div>
        );
    };

    return (
        <Div style={[Style.column, Style.w_p100]}>
            <Div style={[Style.v_center, Style.bg_color_light, Style.p_3]}>
                <Div
                    style={[Style.h_center]}
                    onPress={!_disabled && openAlbumPicker}
                >
                    {_disabled ? (
                        <Icon
                            name="cloud-upload-off-outline"
                            size={Style.f_size_40.fontSize}
                            color={Style.f_color_dark.color}
                        />
                    ) : (
                        <Icon
                            name="cloud-upload-outline"
                            size={Style.f_size_40.fontSize}
                            color={Style.f_color_dark_medium.color}
                        />
                    )}
                </Div>
            </Div>
            <Div style={[Style.row, Style.column_center, Style.m_t_2]}>
                <Text style={[Style.f_size_12, Style.f_color_dark]}>
                    {trans(
                        multiple
                            ? "uploadMultipleRequirement"
                            : "uploadSingleRequirement"
                    )}
                </Text>
            </Div>
            {renderLocalImages()}
        </Div>
    );
};

Uploader.defaultProps = {
    format: "image/jpg,image/jpeg,image/png",
    multiple: false,
    maxFiles: 1,
    disabled: false,
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
};

export default Uploader;
