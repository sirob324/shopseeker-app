import { gql } from "@apollo/client";

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
                image {
                    url
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
            }
        }
    }
`;
