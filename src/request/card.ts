import fetch from "helpers/fetch";
import { encrypt } from "helpers/encrypt";

export const addNewCard = (data: any) => {
    return fetch("card", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};

export const deleteCard = (data: any) => {
    return fetch("card/remove", "POST", {
        ie: true,
        data: encrypt(data).toString(),
    });
};
