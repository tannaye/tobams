import Base from "./base.js";
import { convertToObjectId } from "../helpers/index.js";

export class UserFilter extends Base {
    constructor() {
        super();
    }

    createUserData({ data }) {
        const fields = ["first_name", "last_name", "email", "phone", "password"];

        const userData = this.processData(data, fields);
        userData.password_set = !!userData.password;
        userData.email = userData.email.toLowerCase();
        return userData;
    }

    updateUserData({ data, user }) {
        const fields = ["first_name", "last_name", "email", "phone"];

        const userData = this.processData(data, fields, user);
        userData.email = userData.email.toLowerCase();
        return userData;
    }

    listUserQuery({ query }) {
        const searchFields = ["first_name", "last_name", "email", "phone"];

        const queryFields = ["id-_id", "first_name", "last_name", "email", "phone"];

        return this.getQuery(query, queryFields, searchFields);
    }
}

export default new UserFilter();
