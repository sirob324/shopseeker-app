import React, { FC } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { Region } from "interfaces/region";

import { changeLocale } from "actions/system";
import { updateRegion } from "actions/region";

import Locales, { LANGUAGES } from "locales";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";

import Style from "style";

type Props = {
    locale: string;
    change_locale: Function;
    region: Region;
    change_region: Function;
};

const RegionC: FC<{ region: Region; toggleRegion: Function }> = ({
    region,
    toggleRegion,
}) => {
    const regions = [
        {
            id: "5e9f4b43fd740e00cc8ad0aa",
            slug: "ca-qc-montreal",
        },
        {
            id: "5e9f4b9afd740e00cc8ad0bd",
            slug: "ca-on-toronto",
        },
    ];

    return _.map(regions, (_region: any, index: number) => {
        const isSelected = _region.slug === _.toLower(region.slug);

        return (
            <A key={index} onPress={() => toggleRegion(_region)}>
                <Div
                    style={[
                        Style.h_center,
                        Style.m_1,
                        Style.p_v_1,
                        Style.p_h_1,
                        Style.border_round_1,
                        isSelected
                            ? Style.bg_color_light_dark
                            : Style.bg_color_15,
                    ]}
                >
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_weight_500,
                            Style.f_color_dark_medium,
                        ]}
                    >
                        {Locales.t(_region.slug)}
                    </Text>
                </Div>
            </A>
        );
    });
};

const LanguageC: FC<{ language: string; toggleLanguage: Function }> = ({
    language,
    toggleLanguage,
}) => {
    return _.map(_.keys(LANGUAGES), (locale: string, index: number) => {
        const isSelected = locale === language;

        return (
            <A
                key={index}
                onPress={() => {
                    locale !== language ? toggleLanguage(locale) : _;
                }}
            >
                <Div
                    style={[
                        Style.h_center,
                        Style.m_1,
                        Style.p_v_1,
                        Style.p_h_2,
                        Style.border_round_1,
                        isSelected
                            ? Style.bg_color_light_dark
                            : Style.bg_color_15,
                    ]}
                >
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_weight_500,
                            Style.f_color_dark_medium,
                        ]}
                    >
                        {Locales.t(`locale_${locale}`)}
                    </Text>
                </Div>
            </A>
        );
    });
};

const LanguageRegion: FC<Props> = ({
    locale,
    change_locale,
    region,
    change_region,
}) => {
    return (
        <Div style={[Style.column, Style.row_center, Style.m_t_2]}>
            <Div style={[Style.p_h_3, Style.p_b_2, Style.b_b]}>
                <Text
                    style={[
                        Style.f_size_15,
                        Style.f_color_3,
                        Style.f_weight_600,
                    ]}
                >
                    {Locales.t(
                        "chooseLanguageAndRegion",
                        "Choose a language and region"
                    )}
                </Text>
            </Div>
            <Div style={[Style.column, Style.row_center]}>
                <Div
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.wrap,
                        Style.p_v_2,
                        Style.p_h_3,
                        Style.bg_color_light,
                    ]}
                >
                    <LanguageC
                        language={locale}
                        toggleLanguage={change_locale}
                    />
                </Div>
                {/* <Div
                    style={[
                        Style.row,
                        Style.column_center,
                        Style.wrap,
                        Style.p_v_2,
                        Style.p_h_3,
                    ]}
                >
                    <RegionC region={region} toggleRegion={change_region} />
                </Div> */}
            </Div>
        </Div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        locale: state.system.locale,
        region: state.region,
    };
};

const mapDispatchToProps = (dispatch: Function) => {
    return {
        change_locale: (locale: string) => dispatch(changeLocale(locale)),
        change_region: (region: Region) => dispatch(updateRegion(region)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageRegion);
