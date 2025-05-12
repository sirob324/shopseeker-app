import { gql } from "@apollo/client";

export const ORDER_DETAIL = gql`
    query getOrder($id: ID!) {
        order(id: $id) {
            status
            serial
            currency
            subtotal
            totalTax
            discount
            items
            createdAt
            shippingType
            shipping
            paymentStatus
            merchant {
                region {
                    timezone
                }
                name
                phone
                line1
                line2
                city
                state
                country
                postal_code
            }
        }
    }
`;

export const CATEGORIES = gql`
    query getCategories($where: JSON, $sort: String) {
        categories(where: $where, sort: $sort) {
            id
            sequence
            title
        }
    }
`;

export const MORE_ORDERS = gql`
    query getMoreOrders(
        $where: JSON
        $offset: Int
        $limit: Int
        $sort: String
    ) {
        moreOrders(where: $where, start: $offset, limit: $limit, sort: $sort) {
            items {
                id
                serial
                currency
                subtotal
                totalTax
                discount
                items
                createdAt
                shippingType
                paymentStatus
                merchant {
                    region {
                        timezone
                    }
                }
            }
            hasMore
        }
    }
`;

export const CATEGORY_DETAIL_WITH_FETCH = `
    query getCategory($id: ID!) {
        category(id: $id) {
            id
            sequence
            title
        }
    }
`;

export const PRODUCT_DETAIL_WITH_FETCH = `
    query getProduct($id: ID!) {
        product(id: $id) {
            id
            hasTax
            sequence
            title
            measure
            measureUnit
            price
            salePrice
            description
            sales
            inventory
            inventoryWarning
            status
            image {
                id
                name
                url
            }
            gallery {
                id
                name
                url
            }
            type {
                id
                title
            }
            category {
                id
                title
            }
        }
    }
`;

export const MORE_PRODUCTS = gql`
    query getMoreProducts(
        $where: JSON
        $offset: Int
        $limit: Int
        $sort: String
    ) {
        moreProducts(
            where: $where
            start: $offset
            limit: $limit
            sort: $sort
        ) {
            items {
                id
                hasTax
                sequence
                title
                measure
                measureUnit
                price
                salePrice
                description
                sales
                inventory
                inventoryWarning
                image {
                    id
                    name
                    url
                    formats
                }
                gallery {
                    id
                    name
                    url
                }
                type {
                    id
                    title
                }
                category {
                    id
                    title
                }
            }
            hasMore
        }
    }
`;

export const COUPONS = gql`
    query getCoupons($merchant: String, $status: String) {
        coupons(where: { status: $status, merchant: $merchant }) {
            id
            title
            code
            number_of_used
            number
            expiration
            createdAt
            status
        }
    }
`;
