import React, { useState } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";

import { trans } from "locales";

import Style from "style";

import { useDeliver } from "deliver/contexts/app";

import Identity from "deliver/containers/profile/post";
import ExternalAccount from "deliver/containers/profile/post";

const SettingsCard = (props: any) => {
    const { title, subtitle, onClick } = props;

    return (
        <A
            style={[
                Style.column,
                Style.row_center,
                Style.column_start,
                Style.bg_color_15,
                Style.shadow,
                Style.m_t_5,
                Style.p_3,
                Style.border_round_2,
            ]}
            onPress={onClick}
        >
            <Text
                style={[
                    Style.f_size_15,
                    Style.f_weight_600,
                    Style.f_color_primary,
                    Style.m_b_2,
                ]}
            >
                {title}
            </Text>
            <Text
                style={[
                    Style.f_size_13,
                    Style.f_weight_500,
                    Style.f_color_dark,
                ]}
            >
                {subtitle}
            </Text>
        </A>
    );
};

const ProfilePage = (props: any) => {
    const { deliver } = useDeliver();

    const businessType = _.get(deliver, "entity", "");

    const [progress, changeProgress] = useState("home");

    let component = <></>;

    switch (progress) {
        case "identity":
            component = (
                <Identity
                    {...props}
                    type="identity"
                    deliver={deliver}
                    changeNav={(progress: string) => changeProgress(progress)}
                />
            );
            break;

        case "external_account":
            component = (
                <ExternalAccount
                    {...props}
                    type="external_account"
                    deliver={deliver}
                    changeNav={(progress: string) => changeProgress(progress)}
                />
            );
            break;

        case "home":
            component = (
                <Div style={[Style.column, Style.h_p100, Style.p_h_3]}>
                    {businessType === "individual" && (
                        <SettingsCard
                            title={trans("personalSetting")}
                            subtitle={trans("personalSettingTitle")}
                            onClick={() => changeProgress("identity")}
                        />
                    )}
                    <SettingsCard
                        title={trans("bankAccountSetting")}
                        subtitle={trans("bankAccountSettingTitle")}
                        onClick={() => changeProgress("external_account")}
                    />
                </Div>
            );
            break;
    }

    return <Div style={[Style.column, Style.h_p100]}>{component}</Div>;
};

export default ProfilePage;
