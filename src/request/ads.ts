import fetch from "helpers/fetch";

export const getAds = () => {
    return fetch("ads", "GET");
};
