export interface Tax {
    type: string;
    value: number;
}

export interface Category {
    id: string;
    sequence: number;
    title: string;
}

export interface Type {
    id: string;
    sequence: number;
    title: string;
}

export interface Region {
    id: string;
    sequence: number;
    slug: string;
    title: string;
    city: string;
    state: string;
    country: string;
    coordinates: number[];
    currency: string;
    mileage: string;
    timezone: string;
    taxes: Tax[];
    types: Type[];
}
