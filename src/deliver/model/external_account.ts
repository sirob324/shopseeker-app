import Bank from "model/bank";

const external_account = {
    CA: {
        country: {
            type: "text",
            name: "country",
            value: "CA",
            label_trans: "address_country",
            disabled: true,
            required: true,
        },
        currency: {
            type: "text",
            name: "currency",
            value: "CAD",
            label_trans: "bank_currency",
            disabled: true,
            required: true,
        },
        routing_number: {
            type: "mask",
            mask: Bank.CA.routing_number.mask,
            placeholder: Bank.CA.routing_number.placeholder,
            name: "routing_number",
            label_trans: "bank_routing_number",
            note: "Format: transit-institution",
            required: true,
        },
        account_number: {
            type: "mask",
            mask: Bank.CA.account_number.mask,
            placeholder: Bank.CA.account_number.placeholder,
            name: "account_number",
            label_trans: "bank_account_number",
            note: "Your bank account must be a checking account.",
            required: true,
        },
    },
};

export default external_account;
