import React, { FC } from "react";
import _ from "lodash";

import { Contact } from "interfaces/profile";

import A from "components/a";
import Icon from "components/icon";
import Div from "components/div";

import Style from "style";

import RealContact from "./card";

type Props = {
    item: Contact;
    onEdit?: any;
    onDelete?: any;
    hasEdit?: boolean;
    hasDelete?: boolean;
    style?: any;
};

const ContactCard: FC<Props> = (props) => {
    const { item, onDelete, onEdit, hasDelete, hasEdit } = props;

    return (
        <Div style={[Style.column]}>
            <Div
                style={[
                    Style.row,
                    Style.top_right,
                    {
                        top: 10,
                        right: 10,
                    },
                ]}
            >
                {hasEdit === true && !_.isNil(onEdit) && (
                    <A onPress={onEdit} style={[Style.m_r_4]}>
                        <Icon
                            name="edit"
                            size={Style.f_size_20.fontSize}
                            color={Style.f_color_dark.color}
                        />
                    </A>
                )}
                {hasDelete === true && !_.isNil(onDelete) && (
                    <A onPress={onDelete}>
                        <Icon
                            name="trash-outline"
                            size={Style.f_size_20.fontSize}
                            color={Style.f_color_dark.color}
                        />
                    </A>
                )}
            </Div>

            <RealContact data={item} />
        </Div>
    );
};

export default ContactCard;
