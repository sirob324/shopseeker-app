import React, { FC } from "react";
import _ from "lodash";

import Div from "components/div";
import Text from "components/text";
import Icon from "components/icon";
import Image from "components/image";

import Style from "style";

import Amex from "assets/icon/amex.png";
import Dinersclub from "assets/icon/dinersclub.png";
import Discover from "assets/icon/discover.png";
import Jcb from "assets/icon/jcb.png";
import Mastercard from "assets/icon/mastercard.png";
import Unionpay from "assets/icon/unionpay.png";
import Visa from "assets/icon/visa.png";

type Props = {
    name?: string;
    brand: string;
    last4: string;
    color?: string;
    exp_month?: string;
    exp_year?: string;
};

const Card: FC<Props> = ({
    name = "",
    brand,
    last4,
    exp_month = "0",
    exp_year = "0",
}) => {
    const issuer = _.toLower(brand);

    let issuerLogo: any = <Text>{_.upperFirst(issuer)}</Text>;

    if (issuer === "amex") {
        issuerLogo = <Image src={Amex} />;
    } else if (issuer === "dinersclub") {
        issuerLogo = <Image src={Dinersclub} />;
    } else if (issuer === "discover") {
        issuerLogo = <Image src={Discover} />;
    } else if (issuer === "jcb") {
        issuerLogo = <Image src={Jcb} />;
    } else if (issuer === "mastercard") {
        issuerLogo = <Image src={Mastercard} />;
    } else if (issuer === "unionpay") {
        issuerLogo = <Image src={Unionpay} />;
    } else if (issuer === "visa") {
        issuerLogo = <Image src={Visa} />;
    }

    return (
        <Div style={[Style.column, Style.p_h_3, Style.p_v_4]}>
            <Div style={[Style.h_center, { width: 26, height: 17.06 }]}>
                {issuerLogo}
            </Div>
            <Div style={[Style.h_center, Style.m_t_2]}>
                {_.map([1, 2, 3], (index: number) => (
                    <Div
                        key={index}
                        style={[
                            Style.row,
                            Style.column_center,
                            Style.row_between,
                        ]}
                    >
                        <Icon
                            name="asterisk"
                            size={Style.f_size_10.fontSize}
                            color={Style.f_color_dark.color}
                        />
                        <Icon
                            name="asterisk"
                            size={Style.f_size_10.fontSize}
                            color={Style.f_color_dark.color}
                        />
                        <Icon
                            name="asterisk"
                            size={Style.f_size_10.fontSize}
                            color={Style.f_color_dark.color}
                        />
                    </Div>
                ))}
                <Text
                    style={[Style.m_l_2, Style.f_size_15, Style.f_weight_500]}
                >
                    {last4}
                </Text>
            </Div>
            <Div
                style={[
                    Style.row,
                    Style.column_center,
                    Style.row_start,
                    Style.m_t_4,
                ]}
            >
                {name && (
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_dark,
                            Style.f_weight_500,
                            Style.text_capital,
                        ]}
                    >
                        {name}
                    </Text>
                )}
                {_.toNumber(exp_month) > 0 && _.toNumber(exp_year) > 0 && (
                    <Text
                        style={[
                            Style.f_size_13,
                            Style.f_color_dark,
                            Style.f_weight_600,
                            Style.m_l_8,
                        ]}
                    >
                        {`${exp_month} / ${exp_year}`}
                    </Text>
                )}
            </Div>
        </Div>
    );
};

export default Card;
