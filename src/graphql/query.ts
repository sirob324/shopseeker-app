import { gql } from "@apollo/client";

export const SEARCH_REGIONS_FOR_INIT = `
    query getRegions($where: JSON, $sort: String) {
        regions(
            where: $where
            sort: $sort
        ) {
            id
            title
            types(sort: "sequence:desc") {
                id
                title
                slug
            }
        }
    }
`;

export const REGIONS = gql`
    query regions {
        id
        title
        slug
        city
        state
        country
        coordinates
        currency
        mileage
        timezone
        taxes {
            type
            value
        }
    }
`;

export const REGION_BY_SLUG = gql`
    query getRegionBySlug($slug: String!) {
        regionBySlug(slug: $slug) {
            id
            sequence
            slug
            title
            city
            state
            country
            coordinates
            currency
            mileage
            timezone
            taxes {
                type
                value
            }
            types(sort: "sequence:desc") {
                id
                title
            }
        }
    }
`;

export const SEARCH_MERCHANTS = gql`
    query getMoreMerchants(
        $offset: Int
        $limit: Int
        $where: JSON
        $sort: String
    ) {
        moreMerchants(
            start: $offset
            limit: $limit
            where: $where
            sort: $sort
        ) {
            items {
                id
                name
                intro
                description
                logo {
                    url
                }
                banner {
                    url
                }
                ads {
                    url
                }
                coordinates
                region {
                    id
                    slug
                    city
                    state
                    country
                    coordinates
                    currency
                    mileage
                    timezone
                    taxes {
                        type
                        value
                    }
                }
            }
            hasMore
        }
    }
`;

export const SEARCH_PRODUCTS = gql`
    query getMoreProducts(
        $offset: Int
        $limit: Int
        $where: JSON
        $sort: String
    ) {
        moreProducts(
            start: $offset
            limit: $limit
            where: $where
            sort: $sort
        ) {
            items {
                id
                hasTax
                title
                measure
                measureUnit
                price
                salePrice
                description
                image {
                    url
                    formats
                }
                gallery {
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
                merchant {
                    id
                    name
                    logo {
                        url
                    }
                    coordinates
                    region {
                        id
                        slug
                        city
                        state
                        country
                        coordinates
                        currency
                        mileage
                        timezone
                        taxes {
                            type
                            value
                        }
                    }
                }
            }
            hasMore
        }
    }
`;

export const ORDERS = gql`
    query getOrders($status: String, $limit: Int, $searchText: String) {
        orders(status: $status, limit: $limit, searchText: $searchText) {
            id
            customer_id
            creation_date
            delivery_address
            amount
            payment_method
            contact_number
            status
        }
    }
`;

export const MY_ORDERS = gql`
    query myorders($account: String, $offset: Int, $limit: Int) {
        moreOrders(
            sort: "createdAt:desc"
            limit: $limit
            start: $offset
            where: { account: $account }
        ) {
            items {
                id
                serial
                items
                subtotal
                totalTax
                discount
                currency
                status
                createdAt
                delivery {
                    fee
                    tip
                    currency
                    distance
                    duration
                    status
                    shipping
                    source
                    destination
                }
                merchant {
                    logo {
                        url
                    }
                    name
                    region {
                        id
                        slug
                        city
                        state
                        country
                        coordinates
                        currency
                        mileage
                        timezone
                        taxes {
                            type
                            value
                        }
                    }
                }
            }
            hasMore
        }
    }
`;

export const ORDER_DETAIL = gql`
    query getOrder($id: ID!) {
        order(id: $id) {
            serial
            items
            currency
            subtotal
            totalTax
            discount
            createdAt
            shippingType
            shipping
            payment {
                createdAt
                currency
                amount
                method_type
                method
                api_status
            }
            delivery {
                createdAt
                status
                currency
                fee
                tip
                contact
                destination
                receivedTime
                inDeliveryTime
                deliveredTime
                deliver {
                    first_name
                    last_name
                    phone
                }
            }
            merchant {
                name
                phone
                line1
                line2
                city
                state
                country
                postal_code
                region {
                    timezone
                }
            }
        }
    }
`;

export const SHOP_HOME = `
    query getMerchant($id: ID!) {
        merchant(id: $id) {
            id
            name
            intro
            description
            logo {
                url
                formats
            }
            banner {
                url
                formats
            }
            ads {
                url
            }
            type {
                id
                title
            }
            coordinates
            region {
                id
                slug
                city
                state
                country
                coordinates
                currency
                mileage
                timezone
                taxes {
                    type
                    value
                }
            }
        }
        topSales: products(
            where: {
                merchant: $id,
                status: "online",
                salePrice_eq: 0
            }
            sort: "sales:desc"
            start: 0
            limit: 10
        ) {
            id
            hasTax
            title
            measure
            measureUnit
            price
            salePrice
            description
            image {
                url
                formats
            }
            gallery {
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
            merchant {
                id
                name
                logo {
                    url
                }
                coordinates
                region {
                    id
                    slug
                    city
                    state
                    country
                    coordinates
                    currency
                    mileage
                    timezone
                    taxes {
                        type
                        value
                    }
                }
            }
        }
        coupons: products(
            where: {
                merchant: $id,
                status: "online",
                salePrice_ne: 0,
                salePrice_null: false
            }
            start: 0
            limit: 10
        ) {
            id
            hasTax
            title
            measure
            measureUnit
            price
            salePrice
            description
            image {
                url
                formats
            }
            gallery {
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
            merchant {
                id
                name
                logo {
                    url
                }
                coordinates
                region {
                    id
                    slug
                    city
                    state
                    country
                    coordinates
                    currency
                    mileage
                    timezone
                    taxes {
                        type
                        value
                    }
                }
            }
        }
        products(
            where: {
                merchant: $id,
                status: "online"
            },
            sort: "createdAt:desc",
            limit: 3000
        ) {
            id
            title
            measure
            measureUnit
            hasTax
            price
            salePrice
            description
            image {
                url
                formats
            }
            gallery {
                url
            }
            type {
                id
                title
            }
            category {
                id
                title
                sequence
            }
            merchant {
                id
                name
                logo {
                    url
                }
                coordinates
                region {
                    id
                    slug
                    city
                    state
                    country
                    coordinates
                    currency
                    mileage
                    timezone
                    taxes {
                        type
                        value
                    }
                }
            }
        }
    }
`;

export const ACCOUNT = `
    query getAccount($id: String!) {
        accounts(limit: 1, where: { user: $id }) {
            id
            first_name
            last_name
            avatar {
                url
            }
            gender
            dob
            hometown
            addresses(sort: "updatedAt:desc") {
                id
                default
                first_name
                last_name
                phone
                line1
                line2
                city
                state
                country
                postal_code
                coordinates
            }
            cards(sort: "updatedAt:desc") {
                id
                default
                brand
                name
                funding
                last4
                exp_month
                exp_year
            }
        }
    }
`;

export const DELIVER = `
    query getDeliver($id: String!) {
        delivers(limit: 1, where: { user: $id }) {
            id
            avatar {
                url
            }
            first_name
            last_name
            gender
            dob
            license_type
            license_number
            license_img {
                url
            }
            phone
            email
            line1
            line2
            city
            state
            country
            postal_code
            coordinates
            entity
            status
            region {
                id
                slug
                city
                state
                country
                coordinates
                currency
                mileage
                timezone
                taxes {
                    type
                    value
                }
            }
        }
    }
`;

export const MERCHANT = `
    query getMerchant($id: String!) {
        merchants(limit: 1, where: { user: $id }) {
            id
            logo {
                url
            }
            banner {
                url
            }
            name
            description
            phone
            email
            line1
            line2
            city
            state
            country
            postal_code
            coordinates
            entity
            status
            region {
                id
                slug
                city
                state
                country
                coordinates
                currency
                mileage
                timezone
                taxes {
                    type
                    value
                }
            }
            type {
                id
                title
                slug
            }
            categories {
                id
                title
                sequence
            }
        }
    }
`;

export const GET_COUPON = gql`
    query {
        coupons {
            id
            code
            image {
                url
            }
            type
            value
        }
    }
`;
