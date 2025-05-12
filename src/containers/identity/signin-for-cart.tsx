import React, { FC } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";

import Login from "containers/identity/login";
import Signin from "containers/identity/signin";

import { redirectToApp, redirectToShop } from "utils/navigation";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const SigninForCart: FC<Props> = (props) => {
    const { changeNav, callback } = props;

    // const callback = () => {
    //     if (merchant && _.has(merchant, "id")) {
    //         goToShop(merchant.id, { tab: "profile", sub_tab: "signup" });
    //     } else {
    //         goToApp({ tab: "profile", sub_tab: "signup" });
    //     }
    // };

    return (
        <Div style={[Style.column]}>
            <Signin
                {...props}
                title={trans("signinForCheckout")}
                titleStyle={[
                    Style.f_size_20,
                    Style.f_weight_600,
                    Style.text_left,
                    Style.m_v_4,
                ]}
                changeNav={changeNav}
                callback={callback}
            />

            <Login {...props} changeNav={changeNav} />

            <A style={[Style.h_center, Style.m_t_4]} onPress={callback}>
                <Text style={[Style.f_size_15, Style.f_color_dark]}>
                    {trans("dontHaveAccount")}
                </Text>
                <Text
                    style={[
                        Style.f_size_15,
                        Style.f_weight_500,
                        Style.underline,
                        Style.m_l_2,
                    ]}
                >
                    {trans("signup")}
                </Text>
            </A>
        </Div>
    );
};

export default SigninForCart;
