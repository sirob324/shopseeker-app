import Phone from "./phone";
import State from "./country";
import Postal from "./postal";

const Contact = {
    CA: {
        first_name: {
            type: "text",
            name: "first_name",
            label_trans: "input_first_name",
            required: true,
        },
        last_name: {
            type: "text",
            name: "last_name",
            label_trans: "input_last_name",
            required: true,
        },
        phone: {
            type: "mask",
            mask: Phone.CA.mask,
            placeholder: Phone.CA.placeholder,
            name: "phone",
            label_trans: "input_phone",
            required: true,
        },
        line1: {
            type: "text",
            name: "line1",
            label_trans: "input_address",
            trans: "address_line1",
            required: true,
            className: "mt-4",
        },
        line2: {
            type: "text",
            name: "line2",
            trans: "address_line2",
            required: false,
        },
        city: {
            type: "text",
            name: "city",
            trans: "address_city",
            required: true,
        },
        state: {
            type: "choices",
            choices: State.CA,
            name: "state",
            trans: "address_state",
            required: true,
        },
        postal_code: {
            type: "mask",
            mask: Postal.CA.mask,
            placeholder: Postal.CA.placeholder,
            name: "postal_code",
            required: true,
        },
        country: {
            type: "text",
            name: "country",
            value: "CA",
            trans: "address_country",
            disabled: true,
            required: true,
        },
    },
};

export default Contact;
