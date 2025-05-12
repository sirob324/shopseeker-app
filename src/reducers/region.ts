import { REGION } from "actions/types";

interface ACTION {
    type: string;
    payload: any;
}

export const initialState = {
    id: "",
    sequence: 1,
    slug: "ca-qc-montreal",
    title: "Montréal",
    city: "montreal",
    state: "qc",
    country: "ca",
    coordinates: [-79.5181417, 43.7181557],
    currency: "cad",
    mileage: "m",
    timezone: "America/Toronto",
    taxes: [
        {
            type: "QST",
            value: 9.9975,
        },
        {
            type: "GST",
            value: 5,
        },
    ],
    types: [],
};

function Region(state = initialState, action: ACTION) {
    switch (action.type) {
        case REGION.UPDATE:
            return action.payload;

        case REGION.RESET:
            return initialState;

        default:
            return state;
    }
}

export default Region;
