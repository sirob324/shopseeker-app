import React, { FC } from "react";

import WebView from "components/web";

import { WEB_PRIVACY_PAGE } from "config/route";

type Props = {
    [key: string]: any;
};

const PrivacyPage: FC<Props> = (props) => {
    const { navigation } = props;

    return <WebView url={WEB_PRIVACY_PAGE} navigation={navigation} />;
};

export default PrivacyPage;
