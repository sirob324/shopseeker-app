import _ from "lodash";

const Log = (data: any) => {
    if (data instanceof Error) {
        console.log(data);
    } else {
        console.log(data);
    }
};

export default Log;
