import logger from "../../helpers/logger.js";
import handleResponse from "../../helpers/response.js";
import { User } from "../../database/index.js";

export class DashboardController {
    constructor() {
        this.logger = logger;
        this.handleResponse = handleResponse;
        this.User = User;
    }

    async getDashboard({ user }) {
        logger.debug("Getting dashboard params");
        try {
            Reflect.deleteProperty(user, "password");

            const message = `Welcome to your dashboard, ${user.username}`;
            return this.handleResponse(200, message, {});
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }
}
