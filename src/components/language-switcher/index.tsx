import React, { useState } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { changeLocale as changeLocaleAction } from "actions/system";

import A from "components/a";
import Div from "components/div";
import Icon from "components/icon";
import Text from "components/text";
import Modal from "components/modal";

import { LANGUAGES, trans } from "locales";

import Style from "style";

const LanguageSwitcher = ({ changeLocale, locale }) => {
    const [visible, setVisible] = useState(false);

    return (
        <Div style={[Style.column]}>
            <A
                onPress={() => setVisible(!visible)}
                style={[Style.p_v_2, Style.p_r_3]}
            >
                <Icon
                    name="language"
                    size={Style.f_size_25.fontSize}
                    color={Style.f_color_dark_medium.color}
                />
            </A>
            {visible && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={visible}
                    presentationStyle="overFullScreen"
                    onDismiss={() => setVisible(!visible)}
                    style={{
                        container: {
                            marginTop: 80,
                        },
                        content: {
                            ...Style.bg_color_15,
                            ...Style.shadow_bottom,
                            ...Style.p_2,
                        },
                    }}
                    renderContent={() => (
                        <Div
                            style={[Style.row, Style.column_center, Style.wrap]}
                            onPress={() => setVisible(!visible)}
                        >
                            {_.map(
                                _.keys(LANGUAGES),
                                (language: string, index: number) => {
                                    return (
                                        <A
                                            key={index}
                                            onPress={() => {
                                                changeLocale(language);
                                                setVisible(!visible);
                                            }}
                                            style={[
                                                Style.p_2,
                                                Style.m_1,
                                                Style.b_light,
                                                Style.border_round_1,
                                                locale === language &&
                                                    Style.bg_color_light,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    Style.f_size_13,
                                                    Style.f_weight_500,
                                                ]}
                                            >
                                                {trans(`locale_${language}`)}
                                            </Text>
                                        </A>
                                    );
                                }
                            )}
                        </Div>
                    )}
                />
            )}
        </Div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        locale: state.system.locale,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        changeLocale: (locale: any) => dispatch(changeLocaleAction(locale)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcher);
