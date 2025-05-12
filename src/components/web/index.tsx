import React, { FC, useState } from "react";
import { WebView, WebViewProps } from "react-native-webview";

import Div from "components/div";
import Loading from "components/loading";

import Style from "style";

const Web: FC<WebViewProps & { [key: string]: any }> = (props) => {
    const [loading, setLoading] = useState(true);

    const { url, jsScript, onMessage } = props;

    const injectedJavaScript = jsScript || `true;`;

    return (
        <Div style={[Style.flex, Style.bg_color_15]}>
            <WebView
                ref={(webView) => (webView = webView)}
                style={[Style.absolute_fill, Style.bg_color_15]}
                source={{ uri: url }}
                originWhitelist={["https://*"]}
                allowsLinkPreview={true}
                bounces={true}
                javaScriptEnabled={true}
                automaticallyAdjustContentInsets={true}
                dataDetectorTypes="all"
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                hideKeyboardAccessoryView={false}
                geolocationEnabled={true}
                thirdPartyCookiesEnabled={true}
                scrollEnabled={true}
                pagingEnabled={true}
                onLoadProgress={(e) => {}}
                onLoadStart={(e) => {}}
                onLoadEnd={() => setLoading(false)}
                onLoad={(syntheticEvent) => {
                    // const { title } = syntheticEvent.nativeEvent;
                    // navigation.setParams({
                    //     title: title,
                    // });
                }}
                injectedJavaScript={injectedJavaScript}
                onMessage={onMessage}
                mixedContentMode="always"
            />
            {loading && (
                <Div style={[Style.absolute_fill, Style.z_index_1000]}>
                    <Loading />
                </Div>
            )}
        </Div>
    );
};

export default Web;
