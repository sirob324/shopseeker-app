import React, { FC } from "react";

import WebView from "components/web";

import { WEB_TERMS_PAGE } from "config/route";

type Props = {
    [key: string]: any;
};

const TermsPage: FC<Props> = (props) => {
    const { navigation } = props;

    return <WebView url={WEB_TERMS_PAGE} navigation={navigation} />;
};

export default TermsPage;
