import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Model from "model/contact";

import { Region } from "interfaces/region";

import { queryAddress } from "request/address";

import Lib from "helpers/lib";

import Div from "components/div";
import Text from "components/text";
import Input from "components/input";
import Select from "components/select";
import Button from "components/button";
import Loading from "components/loading";
import MaskedInput from "components/masked-input";

import Locales from "locales";

import Style from "style";

const contactAddressKeys = [
    "first_name",
    "last_name",
    "phone",
    "line1",
    "line2",
    "city",
    "state",
    "country",
    "postal_code",
];

type Props = {
    region: Region;
    getContact: Function;
    [key: string]: any;
};

type State = {
    loading: boolean;
    attrs: { [key: string]: object };
    item: { [key: string]: any };
    stableItem: { [key: string]: any };
    showItems: { [key: string]: any };
    requiredFields: { [key: string]: any };
    message: string;
    canSubmit: boolean;
};

class ContactGuestModal extends Component<Props, State> {
    static defaultProps = {
        data: {},
    };

    state = {
        loading: true,
        attrs: {},
        item: {},
        stableItem: {},
        showItems: {},
        requiredFields: {},
        message: "",
        canSubmit: false,
    };

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps: any) {
        if (!_.isEqual(prevProps.data, this.props.data)) {
            this.init();
        }
    }

    init = () => {
        const { data, region } = this.props;

        const country = _.toUpper(region.country);

        try {
            let attrs: { [key: string]: any } = _.get(Model, country);

            if (!_.isEmpty(attrs)) {
                let item: { [key: string]: any } = {};
                let showItems: { [key: string]: any } = {};
                let requiredFields: { [key: string]: any } = {};

                for (let name in attrs) {
                    const { value, required } = attrs[name];

                    const defaultValue =
                        !_.isNil(value) && value
                            ? value
                            : !!_.get(data, name)
                            ? _.get(data, name)
                            : "";

                    item[name] =
                        name === "country" ? Locales.t(country) : defaultValue;

                    showItems[name] = true;

                    if (required === true) {
                        requiredFields[name] = true;
                    }
                }

                this.setState({
                    loading: false,
                    attrs,
                    item,
                    stableItem: item,
                    showItems,
                    requiredFields,
                });
            } else {
                this.setState({
                    loading: false,
                    message: Locales.t("error.unknown"),
                });
            }
        } catch (e) {
            this.setState({
                loading: false,
                message: Locales.t("error.unknown"),
            });
        }
    };

    getItem = (name: string) => {
        const { item } = this.state;

        return _.get(item, name, null);
    };

    onChange = (name: string, value: any) => {
        const { item } = this.state;

        if (name === "postal_code") {
            value = _.toUpper(value);
        } else if (name === "city") {
            value = _.upperFirst(value);
        }

        this.setState(
            {
                item: {
                    ...item,
                    [name]: value,
                },
            },
            () => {
                this.setHeader(name, value);
            }
        );
    };

    setHeader = (name: string, value: any) => {
        const { stableItem, requiredFields } = this.state;

        let hasError: boolean =
            value !== _.get(stableItem, name, "") ? false : true;

        for (var itemName in requiredFields) {
            if (!this.getItem(itemName)) {
                hasError = true;
                break;
            }
        }

        this.setState({ canSubmit: !hasError });
    };

    sendRequest = async () => {
        const { setModalRender, region, getContact } = this.props;

        const { item } = this.state;

        this.setState({ loading: true });

        _.set(item, "country", _.toUpper(region.country));

        const { status, data } = await queryAddress(item);

        if (status === "succeeded") {
            Lib.showToast(Locales.t("succeeded"), {
                onClose: () => {
                    getContact({
                        ...item,
                        ...data,
                    });
                },
                onHidden: () => {
                    this.setState({ loading: false }, () =>
                        setModalRender({ hideModal: true })
                    );
                },
            });
        } else {
            Lib.showToast(Locales.t("failed"), {
                onClose: () => {
                    this.setState({ loading: false });
                },
                onHidden: () => {
                    setModalRender({ hideModal: true });
                },
            });
        }
    };

    renderView = () => {
        const { attrs, showItems } = this.state;

        const inputs =
            _.size(attrs) > 0 &&
            _.map(attrs, (attr: any, index: number) => {
                let input;

                const {
                    type,
                    name,
                    placeholder,
                    trans,
                    mask,
                    label_trans,
                    label,
                    note_trans,
                    note,
                    disabled,
                    required,
                    multiple,
                    choices,
                    className,
                } = attr;

                const _label = !_.isNil(label_trans)
                    ? Locales.t(label_trans)
                    : !_.isNil(label)
                    ? label
                    : "";

                const _note = !_.isNil(note_trans)
                    ? Locales.t(note_trans)
                    : !_.isNil(note)
                    ? note
                    : "";

                const _placeholder = placeholder
                    ? placeholder
                    : trans
                    ? Locales.t(trans)
                    : "";

                switch (type) {
                    case "choices":
                        const options = _.reduce(
                            choices,
                            (res: any[], value: string, key: string) => {
                                res.push({
                                    value: key,
                                    label: value,
                                });

                                return res;
                            },
                            []
                        );

                        input = (
                            <Select
                                value={this.getItem(name)}
                                options={options}
                                onChange={(value: any) => {
                                    this.onChange(name, value);
                                }}
                                placeholder={_placeholder}
                                disabled={disabled || false}
                                multiple={multiple}
                            />
                        );
                        break;

                    case "mask":
                        input = (
                            <MaskedInput
                                value={this.getItem(name)}
                                onChange={(value: any) => {
                                    this.onChange(name, value);
                                }}
                                mask={mask}
                                placeholder={_placeholder}
                            />
                        );
                        break;

                    case "textarea":
                        input = (
                            <Input
                                value={this.getItem(name)}
                                placeholder={_placeholder}
                                onChange={(value: any) => {
                                    this.onChange(name, value);
                                }}
                            />
                        );
                        break;

                    case "number":
                        input = (
                            <Input
                                value={this.getItem(name)}
                                placeholder={_placeholder}
                                type="numeric"
                                onChange={(value: any) => {
                                    this.onChange(
                                        name,
                                        _.isNaN(value) ? 0 : _.toNumber(value)
                                    );
                                }}
                            />
                        );
                        break;

                    case "email":
                    case "text":
                    default:
                        input = (
                            <Input
                                value={this.getItem(name)}
                                placeholder={_placeholder}
                                disabled={disabled}
                                autoCapitalize="none"
                                onChange={(value: any) => {
                                    this.onChange(name, value);
                                }}
                            />
                        );
                        break;
                }

                return _.get(showItems, name, false) === true ? (
                    <Div
                        key={index}
                        style={[
                            Style.column,
                            Style.column_start,
                            Style.row_center,
                            _.includes(contactAddressKeys, name)
                                ? Style.m_b_1
                                : Style.m_b_5,
                        ]}
                        className={className || ""}
                    >
                        {!_.isEmpty(_label) && (
                            <Text
                                style={[
                                    Style.m_b_1,
                                    Style.f_size_12,
                                    Style.f_weight_500,
                                    required
                                        ? Style.f_color_danger
                                        : Style.f_color_dark_medium,
                                ]}
                            >
                                {_label}
                            </Text>
                        )}
                        {input}
                        {!_.isEmpty(_note) && (
                            <Text
                                numberOfLines={1}
                                style={[Style.f_color_dark, Style.m_t_1]}
                            >
                                {_note}
                            </Text>
                        )}
                    </Div>
                ) : null;
            });

        return inputs;
    };

    render() {
        const { region } = this.props;

        const country = _.toUpper(_.get(region, "country", ""));

        if (!country) {
            return (
                <Div>
                    <Text style={[Style.f_size_13, Style.f_color_dark]}>
                        {Locales.t("error.unknown")}
                    </Text>
                </Div>
            );
        }

        const { loading, message, canSubmit } = this.state;

        if (message !== "") {
            return (
                <Div>
                    <Text style={[Style.f_size_13, Style.f_color_dark]}>
                        {message}
                    </Text>
                </Div>
            );
        }

        return (
            <Div style={[Style.w_p100]}>
                {this.renderView()}
                <Button
                    size="fullwidth"
                    trans="save"
                    loading={loading}
                    disabled={!canSubmit}
                    onPress={this.sendRequest}
                    style={[Style.m_t_2]}
                />
            </Div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        region: state.region,
    };
};

export default connect(mapStateToProps)(ContactGuestModal);
