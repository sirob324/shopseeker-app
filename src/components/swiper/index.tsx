import React, { FC } from "react";
import _ from "lodash";
import Swiper, { SwiperProps } from "react-native-swiper";

import Div from "components/div";

import Style from "style";

type Props = {
    style?: any[];
};

const SwiperView: FC<Props & SwiperProps> = (props) => {
    const { style = [], ...rest } = props;

    return (
        <Div style={[Style.w_p100, Style.h_p100, ...style]}>
            <Swiper
                index={0}
                dotColor={Style.f_color_15.color}
                activeDotColor={Style.f_color_first.color}
                {...rest}
            >
                {props.children}
            </Swiper>
        </Div>
    );
};

export default SwiperView;
