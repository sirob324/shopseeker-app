import React, { FC } from "react";
import _ from "lodash";

import { Contact } from "interfaces/profile";

import Div from "components/div";
import Swiper from "components/swiper";
import ContactCard from "components/contact-card";

import Style from "style";

interface Props {
    items: Contact[];
    value?: Contact;
    onChange?: Function;
    onDelete: Function;
    onEdit: Function;
}

const ContactGroup: FC<Props> = ({
    items,
    value,
    onChange,
    onDelete,
    onEdit,
}) => {
    return !_.isEmpty(items) ? (
        <Div style={[Style.column, Style.m_t_2]}>
            <Swiper
                loop={false}
                autoplay={false}
                showsPagination={true}
                showsHorizontalScrollIndicator={false}
            >
                {_.map(items, (item: Contact, index: number) => (
                    <ContactCard
                        key={index}
                        hasEdit={true}
                        hasDelete={true}
                        onChange={onChange ? () => onChange(item) : undefined}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                        item={item}
                        value={value}
                    />
                ))}
            </Swiper>
        </Div>
    ) : null;
};

export default ContactGroup;
