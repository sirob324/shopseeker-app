import React, { ReactNode, useReducer, useContext, createContext } from "react";
import _ from "lodash";

type DrawerProps = {
    isOpen: boolean;
    width?: string | number;
    height?: string | number;
    direction?: "left" | "right";
    template?: string | ReactNode;
    data: object;
    openCallback?: Function;
    closeCallback?: Function;
    openDrawer: Function;
    closeDrawer: Function;
};

function drawerReducer(state: DrawerProps, action: any) {
    switch (action.type) {
        case "OPEN_DRAWER":
            return {
                ...state,
                ...action,
                isOpen: true,
                template: action.template,
                data: action.data,
            };

        case "CLOSE_DRAWER":
            return {
                ...state,
                isOpen: false,
                template: null,
                data: null,
            };

        default:
            return state;
    }
}

const DrawerContext = createContext({} as DrawerProps);

export const DrawerProvider = (props) => {
    const [state, drawerDispatch] = useReducer(drawerReducer, {
        data: null,
        isOpen: false,
    });

    const openDrawer = (payload = {}) => {
        drawerDispatch({
            type: "OPEN_DRAWER",
            ...payload,
        });
    };

    const closeDrawer = (payload = {}) => {
        drawerDispatch({
            type: "CLOSE_DRAWER",
            ...payload,
        });
    };

    return (
        <DrawerContext.Provider
            value={{
                ...state,
                openDrawer,
                closeDrawer,
            }}
        >
            {props.children}
        </DrawerContext.Provider>
    );
};

export const useDrawer = () => {
    return useContext(DrawerContext);
};
