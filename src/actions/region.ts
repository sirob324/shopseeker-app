import { REGION } from "./types";
import { Region } from "interfaces/region";

export function initRegion(data: any) {
    return {
        type: REGION.INIT,
        payload: data,
    };
}

export function updateRegion(data: Region) {
    return {
        type: REGION.UPDATE,
        payload: data,
    };
}

export function resetRegion() {
    return {
        type: REGION.RESET,
    };
}
