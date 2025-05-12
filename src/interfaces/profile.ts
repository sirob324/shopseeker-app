import { Region, Type } from "./region";

export interface Provider {
    profile: object;
    tokens: object;
}

export interface Image {
    url: String;
}

export enum Gender {
    male,
    female,
}

export enum Entity {
    individual,
    company,
    non_profit,
    government_entity,
}

export enum Merchant_status {
    valid,
    invalid,
    closed,
}

export enum License_type {
    id,
    driver,
    passport,
}

export enum Deliver_status {
    valid,
    invalid,
}

export interface User {
    id: string;
    username: string;
    email: string;
    provider: string;
    password: string;
    resetPasswordToken?: string;
    confirmationToken?: string;
    confirmed: boolean;
    blocked: boolean;
    type: string;
    nickname: string;
}

export interface Account {
    user: User;
    addresses: Contact[];
    cards: Card[];
    id: string;
    first_name: string;
    last_name: string;
    gender: Gender;
    dob: Date;
    hometown: string;
    avatar: Image;
    banner: Image;
    stripe: {};
}

export interface Card {
    id: string;
    default: boolean;
    name: string;
    last4: string;
    brand: string;
    funding: string;
    exp_month: string;
    exp_year: string;
    provider: string;
}

export interface Address {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    coordinates?: number[];
}

export interface Contact extends Address {
    id?: string;
    default?: boolean;
    first_name: string;
    last_name: string;
    phone: string;
}

export interface Ads {
    id?: string;
    sequence: number;
    banner: Image;
}

export interface Merchant extends Address {
    user: User;
    region: Region;
    type: Type;
    id: string;
    logo: Image;
    banner: Image;
    name: string;
    intro: string;
    description: string;
    phone: string;
    email: string;
    entity: Entity;
    stripe: {};
    bank: {};
    executive: {};
    status: Merchant_status;
    adses: Ads[];
}

export interface Deliver extends Address {
    user: User;
    region: Region;
    entity: Entity;
    id: string;
    avatar: Image;
    first_name: string;
    last_name: string;
    gender: Gender;
    dob: Date;
    license_type: License_type;
    license_number: string;
    license_img: Image[];
    phone: string;
    email: string;
    stripe: {};
    bank: {};
    task: {};
    status: Deliver_status;
}

export interface Profile {
    user: User;
    account: Account;
    addresses: Contact[];
    cards: Card[];
    deliver: Deliver;
    merchant: Merchant;
}
