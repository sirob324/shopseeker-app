import { gql } from "@apollo/client";

export const ORDERS = gql`
    query getOrders($deliver: String, $status: String, $limit: Int) {
        orders(
            sort: "createdAt:desc"
            limit: $limit
            where: { deliveryStatus: $status, deliver: $deliver }
        ) {
            serial
            deliveryContact
            deliverySource
            deliveryDestination
            deliveryReceivedTime
            deliveryDeliveredTime
            deliveryDuration
            deliveryDistance
            deliveryFee
            items
            currency
        }
    }
`;

export const MORE_ORDERS = gql`
    query getMoreOrders(
        $deliver: String
        $status: String
        $offset: Int
        $limit: Int
    ) {
        moreOrders(
            sort: "createdAt:desc"
            start: $offset
            limit: $limit
            where: { deliver: $deliver, status: $status }
        ) {
            items {
                serial
                deliveryContact
                deliverySource
                deliveryDestination
                deliveryReceivedTime
                deliveryDeliveredTime
                deliveryDuration
                deliveryDistance
                deliveryFee
                items
                currency
            }
            hasMore
        }
    }
`;

export const DELIVERY_DETAIL = gql`
    query getDelivery($id: ID!) {
        delivery(id: $id) {
            id
            createdAt
            receivedTime
            serial
            fee
            tip
            currency
            source
            destination
            duration
            distance
            contact
            status
            order {
                items
                discount
                totalTax
                merchant {
                    logo {
                        url
                    }
                    name
                    phone
                    line1
                    line2
                    city
                    state
                    country
                    postal_code
                    coordinates
                }
            }
        }
    }
`;

export const RECEIVED_DELIVERIES = gql`
    query getReceivedDeliveries($deliver: String, $offset: Int, $limit: Int) {
        moreDeliveries(
            start: $offset
            limit: $limit
            where: { deliver: $deliver, status: "received" }
            sort: "receivedTime:asc"
        ) {
            items {
                id
                createdAt
                receivedTime
                serial
                fee
                tip
                currency
                status
            }
            hasMore
        }
    }
`;

export const INDELIVERY_DELIVERIES = gql`
    query getInDeliveryDeliveries($deliver: String, $offset: Int, $limit: Int) {
        moreDeliveries(
            start: $offset
            limit: $limit
            where: { deliver: $deliver, status: "in_delivery" }
            sort: "inDeliveryTime:asc"
        ) {
            items {
                id
                createdAt
                receivedTime
                inDeliveryTime
                serial
                fee
                tip
                currency
                status
            }
            hasMore
        }
    }
`;

export const DELIVERED_DELIVERIES = gql`
    query getDeliveredDeliveries($deliver: String, $offset: Int, $limit: Int) {
        moreDeliveries(
            start: $offset
            limit: $limit
            where: { deliver: $deliver, status: "delivered" }
            sort: "deliveredTime:desc"
        ) {
            items {
                id
                createdAt
                receivedTime
                inDeliveryTime
                deliveredTime
                serial
                fee
                tip
                currency
                status
            }
            hasMore
        }
    }
`;
