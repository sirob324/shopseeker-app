import React, { FC } from "react";

import Div from "components/div";
import Text from "components/text";

import Style from "style";

type Props = {
    message: string;
};

const ErrorMessage: FC<Props> = ({ message }) => {
    return (
        <Div style={[Style.p_3, Style.bg_color_first]}>
            <Text style={[Style.f_size_14, Style.f_color_15]}>{message}</Text>
        </Div>
    );
};

export default ErrorMessage;
