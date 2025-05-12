import _ from "lodash";
import { call, put, takeLatest, select } from "redux-saga/effects";

import { REGION } from "actions/types";
import { updateRegion } from "actions/region";
import { updateNavRegion, updateNavType } from "actions/nav";

import { updateInstallation } from "helpers/parse";

const init_region = function* ({ payload }: { payload: any }) {
    const { region } = yield select((state) => state);

    if (
        !_.isNil(payload) &&
        !_.isEmpty(payload) &&
        !_.isEqual(region, payload)
    ) {
        yield put(updateRegion(payload));
    }
};

const update_region = function* ({ payload }: { payload: any }) {
    const { id, slug, title, types } = payload;

    // update navigation region
    yield put(
        updateNavRegion({
            id,
            slug,
            title,
        })
    );

    if (
        _.get(payload, "city") &&
        _.get(payload, "state") &&
        _.get(payload, "country")
    ) {
        yield call(updateInstallation, {
            channels: [
                _.get(payload, "city"),
                _.get(payload, "state"),
                _.get(payload, "country"),
            ],
        });
    }

    if (!_.isEmpty(types)) {
        const { id, slug, title } = _.get(types, "0");

        // update navigation type
        yield put(
            updateNavType({
                id,
                slug,
                title,
            })
        );
    }
};

const root = function* () {
    yield takeLatest(REGION.INIT, init_region);
    yield takeLatest(REGION.UPDATE, update_region);
};

export default root;
