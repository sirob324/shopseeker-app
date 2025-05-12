import React, { useState } from "react";
import _ from "lodash";

import Config from "config";

import CountryModel from "model/country";

import { searchRegion } from "request/region";
import { SEARCH_REGIONS_FOR_INIT } from "graphql/query";

import { updateDeliver } from "actions/profile";

import Lib from "helpers/lib";

import Div from "components/div";
import Text from "components/text";
import Button from "components/button";
import Select from "components/select";

import { useDeliver } from "deliver/contexts/app";

import { createDeliver } from "deliver/request";

import { trans } from "locales";

import Style from "style";

const Init = () => {
    const {
        config: { user, region: defaultRegion },
        useDispatch,
    } = useDeliver();

    const [country, setCountry] = useState("");

    const [regions, setRegions] = useState([]);
    const [region, setRegion] = useState({});

    const [businessType, setBusinessType] = useState("");

    const [message, setMessage] = useState("");

    const countryOptions = _.reduce(
        _.keys(CountryModel),
        (res: any[], value: string) => {
            res.push({
                value: _.toUpper(value),
                label: trans(_.toUpper(value)),
            });

            return res;
        },
        [
            {
                value: "",
                label: trans("choose"),
            },
        ]
    );

    const businessTypeOptions = _.reduce(
        {
            individual: trans("business_type_individual"),
            company: trans("business_type_company"),
        },
        (res: any[], value: string, key: string) => {
            res.push({
                value: key,
                label: value,
            });

            return res;
        },
        [
            {
                value: "",
                label: trans("choose"),
            },
        ]
    );

    const changeCountry = async (value: any) => {
        if (value && value !== country) {
            setCountry(value);
            setRegion([]);
            setRegion({});

            const { data, errors } = await searchRegion({
                query: SEARCH_REGIONS_FOR_INIT,
                variables: {
                    where: { country: _.toLower(value) },
                    sort: "sequence:desc",
                },
            });

            if (_.isNil(errors) && !_.isEmpty(_.get(data, "regions", []))) {
                setRegions(data.regions);
            }
        }
    };

    const handleSubmit = async () => {
        const uid = user.id;
        if (!uid) {
            setMessage(trans("error.unknown"));
            return;
        }

        const { status, data } = await createDeliver({
            uid: uid,
            paymentProvider: Config.PAYMENT_PROVIDER,
            businessType,
            region: _.get(region, "id", _.get(defaultRegion, "id", "")),
        });

        if (status === "succeeded") {
            Lib.showToast(trans("succeeded"), {
                onClose: () => {
                    useDispatch(updateDeliver(data));
                },
                style: {
                    ...Style.bg_color_success,
                },
                textStyle: {
                    ...Style.f_color_15,
                },
            });
        } else if (status === "failed") {
            Lib.showToast(data || trans("failed"), {
                style: {
                    ...Style.bg_color_danger,
                },
                textStyle: {
                    ...Style.f_color_15,
                },
            });
        }
    };

    return (
        <Div style={[Style.p_4]}>
            <Div style={[Style.h_center, Style.m_b_8]}>
                <Text
                    style={[
                        Style.f_size_17,
                        Style.f_color_dark_bold,
                        Style.f_weight_500,
                    ]}
                >
                    {trans("creatBusinessProfile")}
                </Text>
            </Div>

            <Div style={[Style.column, Style.row_center, Style.m_b_5]}>
                <Text
                    style={[Style.f_size_15, Style.f_weight_500, Style.m_b_2]}
                >
                    {trans("business_region")}
                </Text>
                <Select
                    options={countryOptions}
                    onChange={(value: any) => changeCountry(value)}
                    value={country || null}
                />
                <Div style={{ height: 5 }}></Div>
                {!_.isEmpty(regions) && (
                    <Select
                        options={_.reduce(
                            regions,
                            (res: any[], region: any) => {
                                res.push({
                                    value: region.id,
                                    label: region.title,
                                });

                                return res;
                            },
                            [
                                {
                                    value: "",
                                    label: trans("choose"),
                                },
                            ]
                        )}
                        onChange={(value: any) =>
                            setRegion(_.find(regions, ["id", value]))
                        }
                        value={
                            !_.isEmpty(region)
                                ? _.get(region, "id", null)
                                : _.get(region, "0.id", null)
                        }
                    />
                )}
            </Div>

            <Div style={[Style.column, Style.row_center, Style.m_b_5]}>
                <Text
                    style={[Style.f_size_15, Style.f_weight_500, Style.m_b_2]}
                >
                    {trans("business_type")}
                </Text>
                <Select
                    options={businessTypeOptions}
                    onChange={(value: any) => setBusinessType(value)}
                    value={businessType || null}
                />
            </Div>

            {message !== "" && (
                <Div style={[Style.m_v_2]}>
                    <Text style={[Style.f_size_15, Style.f_color_danger]}>
                        {message}
                    </Text>
                </Div>
            )}

            <Button
                size="fullwidth"
                trans="submit"
                disabled={
                    country === "" || businessType === "" || _.isEmpty(region)
                }
                onPress={handleSubmit}
            />
        </Div>
    );
};

export default Init;
