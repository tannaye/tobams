/* eslint-disable no-unused-vars */
import moment from "moment";
import Validator from "validatorjs";
import { convertToObjectId } from "../helpers/index.js";
import handleResponse from "../helpers/response.js";

export class Validation {
    constructor() {}

    validator(body, rules, customMessages, callback) {
        const validation = new Validator(body, rules, customMessages);
        validation.passes(() => callback(null, true));
        validation.fails(() => callback(validation.errors, false));
    }

    sendError(res, err, message = null) {
        const firstError = err ? err.errors[Object.keys(err.errors)[0]][0] : null;
        return handleResponse(412, message ? message : firstError, null, res);
    }
}

const { register } = Validator;

register(
    "date_format",
    function (value, requirement, attribute) {
        return moment(value, "DD/MM/YYYY", true).isValid();
    },
    `invalid date format. Date format should be 'DD/MM/YYYY'`,
);

register(
    "gender",
    function (value, requirement, attribute) {
        return !(
            value.toLowerCase() !== "male" &&
            value.toLowerCase() !== "female" &&
            value.toLowerCase() !== "others"
        );
    },
    "invalid gender, gender must be either 'male', 'female' or 'others'",
);

register(
    "arrayLength",
    function (value, requirement, attribute) {
        console.log(value, attribute);
        return value.length !== 0;
    },
    `:attribute can't be empty`,
);

register(
    "mongoId",
    function (value, requirement, attribute) {
        return convertToObjectId(value) !== value;
    },
    "invalid :attribute",
);

register(
    "isObject",
    function (value, requirement, attribute) {
        return typeof value === "object" && !Array.isArray(value) && value !== null;
    },
    ":attribute must be an object",
);
