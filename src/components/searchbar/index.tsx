import React, { FC, useState } from "react";
import _ from "lodash";

import A from "components/a";
import Div from "components/div";
import Text from "components/text";
import Input from "components/input";

import { trans } from "locales";

import Style from "style";

type Props = {
    [key: string]: any;
};

const SearchBar: FC<Props> = ({ handleSearch, value, placeholder }) => {
    const [searchValue, setSearchValue] = useState(value);

    return (
        <Div
            style={[
                Style.w_p100,
                Style.row,
                Style.column_center,
                Style.row_between,
                Style.bg_color_light,
                Style.border_round_1,
            ]}
        >
            <Input
                type="text"
                value={searchValue}
                onChange={(value: string) => setSearchValue(value)}
                placeholder={placeholder || trans("searchPlaceholder")}
                textAlign="center"
                style={[Style.flex]}
            />
            <A onPress={() => handleSearch(searchValue)} style={[Style.m_h_3]}>
                <Text style={[Style.f_size_15, Style.f_weight_500]}>
                    {trans("search")}
                </Text>
            </A>
        </Div>
    );
};

export default SearchBar;
