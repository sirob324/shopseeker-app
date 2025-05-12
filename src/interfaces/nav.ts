import { Image } from "./cart";

export interface Nav {
    id: string;
    title: string;
    slug?: string;
    image?: Image;
}
