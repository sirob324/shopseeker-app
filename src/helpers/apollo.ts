import _ from "lodash";
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    useQuery as Query,
    useMutation as Mutation,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

import Config from "config";
import { FETCH_LIMIT } from "config/constant";

import { getToken } from "./profile";

const httpLink = createHttpLink({
    uri: Config.REST_HOST,
    credentials: "same-origin",
});

const authLink = setContext(async (_, { headers }) => {
    const token = await getToken();

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

export const createApolloClient = (cache = {}) =>
    new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache({
            addTypename: false,
        }).restore(cache),
    });

export const useQuery = (query: any, variables: any = null) => {
    return variables
        ? Query(query, {
              variables,
              fetchPolicy: "network-only",
              notifyOnNetworkStatusChange: true,
          })
        : Query(query, {
              fetchPolicy: "network-only",
              notifyOnNetworkStatusChange: true,
          });
};

export const useQueryMore = (query: any, variables: any) => {
    const res = Query(query, {
        variables: _.assign(variables, {
            offset: _.has(variables, "offset") ? variables.offset : 0,
            limit: _.has(variables, "limit") ? variables.limit : FETCH_LIMIT,
        }),
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true,
    });

    return res;
};

export const useMutation = (query: any) => {
    const res = Mutation(query);

    return res;
};
