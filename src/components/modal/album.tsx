import React, { FC } from "react";
import _ from "lodash";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

import Config from "config";
import Loading from "components/loading";

import Style from "style";

type Props = {
    [key: string]: any;
};

const Album: FC<Props> = (props) => {
    const {
        data,
        index,
        visible,
        onCancel,
        renderImage,
        renderHeader,
        renderFooter,
        renderArrowLeft,
        renderArrowRight,
        renderIndicator,
        menus,
        enableImageZoom = true,
        enableSwipeDown = true,
        enablePreload = true,
        saveToLocalByLongPress = false,
        footerContainerStyle = [Style.bg_color_first],
        backgroundColor,
        style,
    } = props;

    const images = _.map(data, (image: any) => {
        return {
            url: `${Config.MEDIA_HOST}${image.url}`,
        };
    });

    return (
        <Modal visible={visible} transparent={true}>
            <ImageViewer
                index={index}
                imageUrls={images}
                renderImage={renderImage}
                enableImageZoom={enableImageZoom}
                loadingRender={() => <Loading />}
                renderIndicator={renderIndicator}
                onCancel={onCancel}
                onClick={(onCancel: any) => onCancel()}
                onDoubleClick={(onCancel: any) => onCancel()}
                enableSwipeDown={enableSwipeDown}
                swipeDownThreshold={1}
                enablePreload={enablePreload}
                saveToLocalByLongPress={saveToLocalByLongPress}
                renderHeader={renderHeader}
                renderFooter={renderFooter}
                renderArrowLeft={renderArrowLeft}
                renderArrowRight={renderArrowRight}
                menus={menus}
                footerContainerStyle={footerContainerStyle}
                backgroundColor={backgroundColor}
                style={style}
            />
        </Modal>
    );
};

export default Album;
