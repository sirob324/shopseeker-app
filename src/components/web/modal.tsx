import React from "react";
import {
    Text,
    View,
    ActivityIndicator,
    TouchableWithoutFeedback,
    StatusBar,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import Modal from "components/modal";

import Style from "style";

type Props = {
    url: string;
    visible: boolean;
    onDismiss: Function;
};

class WebModal extends React.Component<Props> {
    webview: any = null;

    title = "";

    state = {
        canGoBack: false,
        canGoForward: false,
        title: "",
        progress: 0,
    };

    componentWillUnmount() {
        this.title = "";
        this.webview = null;
    }

    render() {
        const { canGoBack, canGoForward } = this.state;

        const { url, visible, onDismiss } = this.props;

        const injectedJavaScript = `true;`;

        return (
            <SafeAreaView style={[Style.theme_content]}>
                <StatusBar
                    hidden={false}
                    barStyle="dark-content"
                    translucent={true}
                />
                <Modal
                    style={{
                        container: {
                            ...Style.w_100,
                            ...Style.bg_color_15,
                        },
                        header: {
                            ...Style.bg_color_15,
                            height: "10%",
                        },
                        content: {
                            height: "90%",
                            ...Style.p_b_10,
                        },
                    }}
                    animationType="slide"
                    visible={visible}
                    renderContent={() => {
                        return (
                            <TouchableWithoutFeedback>
                                <WebView
                                    ref={(ref) => (this.webview = ref)}
                                    style={[Style.bg_color_15]}
                                    source={{ uri: url }}
                                    originWhitelist={["http://", "https://"]}
                                    useWebKit={true}
                                    allowsLinkPreview={true}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    bounces={true}
                                    automaticallyAdjustContentInsets={true}
                                    dataDetectorTypes="all"
                                    allowsInlineMediaPlayback={true}
                                    mediaPlaybackRequiresUserAction={true}
                                    hideKeyboardAccessoryView={false}
                                    geolocationEnabled={true}
                                    thirdPartyCookiesEnabled={true}
                                    scrollEnabled={true}
                                    pagingEnabled={false}
                                    injectedJavaScript={injectedJavaScript}
                                    javaScriptEnabled={true}
                                    startInLoadingState={true}
                                    onLoadStart={() =>
                                        this.setState({ title: "" })
                                    }
                                    onLoad={(syntheticEvent) => {
                                        const { title } =
                                            syntheticEvent.nativeEvent;

                                        this.setState({ title });
                                    }}
                                    onLoadProgress={({ nativeEvent }) => {
                                        const { progress } = nativeEvent;

                                        this.setState({ progress });
                                    }}
                                    onLoadEnd={() =>
                                        this.setState({ progress: 0 })
                                    }
                                    renderLoading={() => (
                                        <View
                                            style={[
                                                Style.flex,
                                                Style.column_center,
                                                Style.row_center,
                                            ]}
                                        >
                                            <ActivityIndicator
                                                animating={true}
                                                color={
                                                    Style.f_color_first.color
                                                }
                                                size="small"
                                            />
                                        </View>
                                    )}
                                    onNavigationStateChange={(navState) => {
                                        if (navState.canGoBack) {
                                            this.setState({
                                                canGoBack: true,
                                            });
                                        }

                                        if (navState.canGoForward) {
                                            this.setState({
                                                canGoForward: true,
                                            });
                                        }
                                    }}
                                />
                            </TouchableWithoutFeedback>
                        );
                    }}
                    renderHeader={() => {
                        return (
                            <View
                                style={[
                                    Style.flex,
                                    Style.column,
                                    Style.row_end,
                                ]}
                            >
                                <View
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.row_center,
                                        Style.p_h_2,
                                        Style.p_v_2,
                                        Style.b_b,
                                    ]}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            Style.f_color_1,
                                            Style.f_size_17,
                                            Style.f_weight_600,
                                        ]}
                                    >
                                        {this.state.title}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        Style.h_2,
                                        Style.bg_color_first,
                                        {
                                            width:
                                                this.state.progress * 100 + "%",
                                        },
                                    ]}
                                />
                            </View>
                        );
                    }}
                    renderFooter={() => {
                        return (
                            <View
                                style={[
                                    Style.shadow,
                                    Style.bottom_horizontal,
                                    Style.bg_color_15,
                                    Style.row,
                                    Style.column_center,
                                    Style.row_between,
                                    Style.p_h_4,
                                    Style.p_v_3,
                                    Style.b_t,
                                ]}
                            >
                                <View
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.row_start,
                                        Style.m_r_1,
                                        {
                                            width: "15%",
                                        },
                                    ]}
                                >
                                    {canGoBack && (
                                        <MaterialCommunityIcons
                                            onPress={() =>
                                                this.webview.goBack()
                                            }
                                            name="arrow-left"
                                            style={[
                                                Style.f_size_25,
                                                Style.f_color_5,
                                            ]}
                                        />
                                    )}
                                    {canGoForward && (
                                        <MaterialCommunityIcons
                                            onPress={() =>
                                                this.webview.goForward()
                                            }
                                            name="arrow-right"
                                            style={[
                                                Style.f_size_25,
                                                Style.f_color_5,
                                                Style.m_l_2,
                                            ]}
                                        />
                                    )}
                                </View>
                                <View
                                    style={[
                                        Style.flex,
                                        Style.row,
                                        Style.column_center,
                                        Style.row_center,
                                    ]}
                                />
                                <View
                                    style={[
                                        Style.row,
                                        Style.column_center,
                                        Style.row_end,
                                        Style.m_l_1,
                                        {
                                            width: "10%",
                                        },
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        onPress={onDismiss}
                                        name="close"
                                        style={[
                                            Style.f_size_25,
                                            Style.f_color_5,
                                        ]}
                                    />
                                </View>
                            </View>
                        );
                    }}
                />
            </SafeAreaView>
        );
    }
}

export default WebModal;
