import { Nav } from "./nav";
import { Coupon } from "./coupon";
import { Region, Tax, Type } from "./region";
import {
    Card,
    User,
    Contact,
    Deliver,
    Merchant as MerchantProfile,
    Account,
} from "./profile";

export interface Gallery {
    url: string;
}

export interface Image {
    url: string;
}

export enum DeliveryStatus {
    waiting,
    received,
    in_delivery,
    delivered,
}

export enum PaymentStatus {
    processing,
    succeeded,
    failed,
    cancelled,
}

export interface Shipping {
    contact: Contact;
    currency: string;
    fee: number;
    tip: number;
    tipRate: number;
    note: string;
    source: number[];
    destination: number[];
    duration: number;
    distance: number;
}

export interface Item {
    region: Region;
    type: Nav;
    category: Nav;
    merchant: Merchant;
    id: string;
    sequence: number;
    title: string;
    price: number;
    salePrice: number;
    measure: number;
    measureUnit: string;
    image: Image;
    gallery: Gallery[];
    description: string;
    hasTax: boolean;
    views: number;
    inventory: number;
    inventoryWarning: number;
    sales: number;
}

export interface CartItem extends Item {
    quantity: number;
    taxes: Tax[];
}

export interface Delivery {
    order: Order;
    deliver: Deliver;
    id: string;
    serial: string;
    contact: Contact;
    source: number[];
    destination: number[];
    duration: number;
    distance: number;
    fee: number;
    tip: number;
    note: string;
    currency: string;
    receivedTime: Date;
    inDeliveryTime: Date;
    deliveredTime: Date;
    status: DeliveryStatus;
    score: number;
    createdTime: Date;
}

export interface Merchant {
    user: User;
    region: Region;
    type: Type;
    categories: Nav[];
    id: string;
    name: string;
    logo: Image;
    coordinates: number[];
    currency: string;
    items: CartItem[];
    shipping: Shipping;
    taxes: Tax[];
}

export interface Cart {
    items: CartItem[];
    merchants: Merchant[];
    subTotalPrice: number;
    totalTax: Tax;
    totalDeliveryFee: number;
    totalDeliveryTip: number;
    coupon: Coupon;
    discount: number;
    totalPrice: number;
}

export interface Progress {
    checked: boolean;
    title: string;
    subtitle: string;
}

export interface Payment {
    orders: Order[];
    currency: string;
    amount: number;
    method_type: string;
    method: Card;
    provider: string;
    api_name: string;
    api_id: string;
    api_metadata: {};
    api_status: string;
    api_data: {};
    charge_id: string;
    charge_status: string;
    charge_data: {};
}

export interface Order {
    payment: Payment;
    account: Account;
    merchant: MerchantProfile;
    delivery: Delivery;
    items: CartItem[];
    id: string;
    serial: string;
    subtotal: number;
    totalTax: number;
    discount: number;
    shippingType: string;
    shipping: Shipping;
    currency: string;
    status: "ready_to_collect" | "picked";
    paymentStatus: PaymentStatus;
    createdAt: Date;
}
