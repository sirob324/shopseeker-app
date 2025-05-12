import React, { Component } from "react";
import _ from "lodash";
import { View, Modal, TouchableOpacity } from "react-native";

import Scroll from "components/scroll";

import Style from "style";

type Props = {
    presentationStyle?:
        | "fullScreen"
        | "pageSheet"
        | "formSheet"
        | "overFullScreen";
    [key: string]: any;
};

class _Modal extends Component<Props> {
    renderHeader() {
        const { style, renderHeader } = this.props;

        return (
            <View
                style={_.get(style, "header", {
                    ...Style.bg_color_15,
                    ...Style.p_3,
                    ...Style.b_b,
                })}
            >
                {renderHeader()}
            </View>
        );
    }

    renderContent() {
        const { style, renderContent } = this.props;

        return (
            <View style={_.get(style, "content", { ...Style.bg_color_15 })}>
                {renderContent()}
            </View>
        );
    }

    renderFooter() {
        const { style, renderFooter } = this.props;

        return (
            <View style={_.get(style, "footer", { ...Style.bg_color_15 })}>
                {renderFooter()}
            </View>
        );
    }

    render() {
        const {
            transparent = false,
            animationType = "slide",
            presentationStyle = "pageSheet",
            visible,
            style,
            onDismiss,
            renderHeader,
            renderContent,
            renderFooter,
        } = this.props;

        return (
            <Modal
                visible={visible}
                transparent={transparent}
                animationType={animationType}
                presentationStyle={presentationStyle}
            >
                <TouchableOpacity onPress={onDismiss} style={{ flex: 1 }}>
                    <Scroll
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode="interactive"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={_.get(style, "container", [
                            Style.w_p100,
                            Style.h_p100,
                            Style.column,
                        ])}
                    >
                        {renderHeader ? this.renderHeader() : null}
                        {renderContent ? this.renderContent() : null}
                        {renderFooter ? this.renderFooter() : null}
                    </Scroll>
                </TouchableOpacity>
            </Modal>
        );
    }
}

export default _Modal;
