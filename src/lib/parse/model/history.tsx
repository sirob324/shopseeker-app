import _ from "lodash";
import Parse from "parse/react-native";

class History extends Parse.Object {
    constructor(attrs = {}) {
        super("ShopHistory");

        if (!_.isEmpty(attrs)) {
            this.set(attrs);
        }
    }

    static find(condition: object) {
        const query = new Parse.Query("ShopHistory");

        _.mapKeys(condition, (v: any, k: string) => query.equalTo(k, v));

        return query.descending("updatedAt").first();
    }

    static findAndSave(condition: object, data: {}) {
        return History.find(condition).then((res) => {
            if (_.isNil(res)) {
                const insert = new History(data);

                return insert.save();
            } else {
                return res;
            }
        });
    }

    static findAll(condition: any) {
        const query = new Parse.Query("ShopHistory");
        const { select, where, offset, limit } = condition;

        if (!_.isEmpty(select)) {
            query.select(select);
        }

        query.skip(offset || 0);
        query.limit(limit || 20);

        _.mapKeys(where, (v: any, k: string) => query.equalTo(k, v));

        return query.descending("updatedAt").find();
    }
}

Parse.Object.registerSubclass("ShopHistory", History);

export default History;
