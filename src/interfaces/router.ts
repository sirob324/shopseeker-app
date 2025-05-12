export type Header = {
    headerLeft?: any;
    headerTitle?: any;
    headerRight?: any;
};

export type Router = {
    route: string;
    params?: object;
    header?: Header;
};
