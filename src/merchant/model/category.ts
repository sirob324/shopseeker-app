const Product = {
    CA: {
        sequence: {
            type: "number",
            name: "sequence",
            value: 1,
            label_trans: "input_sequence",
            required: false,
        },
        title: {
            type: "text",
            name: "title",
            label_trans: "input_title",
            required: true,
        },
    },
    FR: {
        sequence: {
            type: "number",
            name: "sequence",
            value: 1,
            label_trans: "input_sequence",
            required: false,
        },
        title: {
            type: "text",
            name: "title",
            label_trans: "input_title",
            required: true,
        },
    },
};

export default Product;
