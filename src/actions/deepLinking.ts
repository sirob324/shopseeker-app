import { DEEP_LINKING } from "./types";

export function deepLinkingOpen(payload: object) {
    return {
        type: DEEP_LINKING.OPEN,
        payload,
    };
}
