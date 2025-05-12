export interface Coupon {
    id: string;
    title: string;
    status: "valid" | "invalid";
    expiration: Date;
    number: number;
    number_of_used: number;
    image: {
        url: string;
    };
    type: "amount" | "percent";
    value: number;
    code: string;
}
