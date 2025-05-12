import _ from "lodash";
import fetch from "isomorphic-unfetch";

import Config from "config";

import Log from "./log";
import { decrypt } from "./encrypt";
import { getToken } from "./profile";

const HOST = Config.HOST + "/api/v1/";

const Fetch = async (
    url: string,
    method = "GET",
    requestData = {},
    headerConfig = {}
) => {
    const token = await getToken();

    const option: { [key: string]: any } = {};
    const headers: { [key: string]: any } = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    option["headers"] = _.assign(headers, headerConfig);

    if (
        (_.toUpper(method) === "POST" || _.toUpper(method) === "PUT") &&
        !_.isEmpty(requestData)
    ) {
        option["body"] = JSON.stringify(requestData);
    }

    const requestURL = _.startsWith(url, "http") ? url : HOST + url;

    try {
        const res = await fetch(requestURL, {
            credentials: "same-origin",
            method: _.toUpper(method),
            mode: "cors",
            ...option,
        });

        let data = await res.json();

        if (res.ok) {
            if (_.has(data, "ie") && _.has(data, "data")) {
                data = decrypt(data.data);
            }
        }

        return data;
    } catch (error) {
        Log(error);
    }
};

export default Fetch;
