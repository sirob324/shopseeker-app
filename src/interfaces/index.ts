import * as cart from "./cart";
import * as coupon from "./coupon";
import * as nav from "./nav";
import * as profile from "./profile";
import * as region from "./region";

module.exports = {
    ...nav,
    ...cart,
    ...region,
    ...coupon,
    ...profile,
};
