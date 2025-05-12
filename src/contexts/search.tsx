import _ from "lodash";
import React, { useReducer, createContext, FC, useContext } from "react";

type State = {
    type: string;
    keyword: string;
    updateSearch: Function;
    resetSearch: Function;
};

export const SearchContext = createContext({} as State);

type ActionType = { type: "UPDATE" | "RESET"; payload: object };

function reducer(state: any, action: ActionType): any {
    switch (action.type) {
        case "UPDATE":
            return { ...state, ...action.payload };

        case "RESET":
            return {
                ...state,
                keyword: "",
            };

        default:
            return state;
    }
}

type Props = {
    type?: "merchant" | "product";
    keyword?: string;
};

export const SearchProvider: FC<Props> = (props) => {
    const [{ type, keyword }, dispatch] = useReducer(reducer, {
        type: _.get(props, "type") || "merchant",
        keyword: _.get(props, "q") || "",
    });

    const updateSearch = (payload: object) => {
        dispatch({
            type: "UPDATE",
            payload: payload,
        });
    };

    const resetSearch = () => {
        dispatch({
            type: "RESET",
            payload: {},
        });
    };

    return (
        <SearchContext.Provider
            value={{ type, keyword, updateSearch, resetSearch }}
        >
            {props.children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
