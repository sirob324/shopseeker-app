import React, { FC } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";

import Style from "style";

interface Props {
    items: string[];
    value: number;
    onChange?: Function;
}

const TipC: FC<Props> = ({ items, value, onChange }) => {
    return (
        <Div
            style={[
                Style.w_p100,
                Style.row,
                Style.column_center,
                Style.row_between,
            ]}
        >
            {_.map(items, (tip: number, index: number) => {
                const _tip =
                    _.toNumber(tip) < 1 ? tip : _.round(_.divide(tip, 100), 2);

                const _tipTitle = _.round(_tip * 100, 2) + "%";

                const checked = _.isEqual(value, tip);

                return (
                    <A
                        key={index}
                        style={[
                            {
                                paddingVertical: 3,
                                paddingHorizontal: 13,
                            },
                            Style.v_center,
                            Style.border_round_1,
                            Style.b_light_medium,
                            checked && Style.bg_color_primary,
                        ]}
                        onPress={onChange ? () => onChange(_tip) : undefined}
                    >
                        <Text
                            style={[
                                Style.f_size_12,
                                checked && Style.f_color_15,
                            ]}
                        >
                            {_tipTitle}
                        </Text>
                    </A>
                );
            })}
        </Div>
    );
};

export default TipC;
