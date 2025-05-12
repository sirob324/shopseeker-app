import { gql } from "@apollo/client";

export const UPDATE_ORDER = gql`
    mutation ($id: ID!, $data: editOrderInput) {
        updateOrder(input: { where: { id: $id }, data: $data }) {
            order {
                id
                status
            }
        }
    }
`;

export const ADD_CATEGORY = gql`
    mutation ($data: CategoryInput) {
        createCategory(input: { data: $data }) {
            category {
                id
                title
                sequence
            }
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation ($id: ID!, $data: editCategoryInput) {
        updateCategory(input: { where: { id: $id }, data: $data }) {
            category {
                id
                title
                sequence
            }
        }
    }
`;

export const DELETE_CATEGORY = gql`
    mutation ($id: ID!) {
        deleteCategory(input: { where: { id: $id } }) {
            category {
                id
            }
        }
    }
`;

export const ADD_PRODUCT = gql`
    mutation ($data: ProductInput) {
        createProduct(input: { data: $data }) {
            product {
                id
                hasTax
                title
                measure
                measureUnit
                price
                salePrice
                description
                inventory
                inventoryWarning
                image {
                    id
                    url
                    formats
                }
                gallery {
                    id
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
    }
`;

export const UPDATE_PRODUCT = gql`
    mutation ($id: ID!, $data: editProductInput) {
        updateProduct(input: { where: { id: $id }, data: $data }) {
            product {
                id
                hasTax
                title
                measure
                measureUnit
                price
                salePrice
                description
                inventory
                inventoryWarning
                image {
                    id
                    url
                    formats
                }
                gallery {
                    id
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
    }
`;
