import React, { FC } from "react";
import _ from "lodash";
import { Image } from "react-native";

import Placeholder from "assets/image/product-placeholder.png";

import Config from "config";

type Props = {
    [key: string]: any;
};

const ImageView: FC<Props> = (props) => {
    let style = {
        width: "100%",
        height: "100%",
    };

    let src = _.get(props, "src");

    if (_.isPlainObject(src) && _.get(src, "url")) {
        src = _.get(src, "url");
    } else if (_.isPlainObject(src) && _.get(src, "uri")) {
        src = _.get(src, "uri");
    } else if (_.isPlainObject(src) && _.get(src, "path")) {
        src = _.get(src, "path");
    }

    if (_.isNil(src) || !src) {
        src = Placeholder;
    } else if (_.startsWith(_.toLower(src), "/uploads")) {
        src = { uri: Config.MEDIA_HOST + src };
    } else if (_.startsWith(_.toLower(src), "http")) {
        src = { uri: src };
    } else if (_.includes(src, ["data:image"])) {
        src = { uri: src };
    } else {
        src = src;
    }

    if (_.has(props, "style")) {
        if (_.isArray(props.style)) {
            _.forEach(props.style, (value: any) => {
                style = {
                    ...style,
                    ...value,
                };
            });
        } else if (_.isPlainObject(props.style)) {
            style = {
                ...style,
                ...props.style,
            };
        }
    }

    return (
        <Image
            style={style}
            source={src}
            resizeMode={props.resizeMode || "cover"}
            {..._.omit(props, ["src", "style"])}
        />
    );
};

export default ImageView;
