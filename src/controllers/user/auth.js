import logger from "../../helpers/logger.js";
import handleResponse from "../../helpers/response.js";
import { User } from "../../database/index.js";
import { hash, verifyHash, deleteFields } from "../../helpers/index.js";
import { generateJwtToken } from "../../helpers/jwt.js";

export class AuthController {
    constructor() {
        this.logger = logger;
        this.handleResponse = handleResponse;
        this.User = User;
    }

    async register({ data }) {
        logger.debug("Registering user");
        try {
            // check if email exists
            const emailExists = await this.User.findOne({ email: data.email });
            if (emailExists) {
                return this.handleResponse(400, "email already exists");
            }

            // check if username exists
            const usernameExists = await this.User.findOne({ username: data.username });
            if (usernameExists) {
                return this.handleResponse(400, "username already exists");
            }

            // check if phone exists
            const phoneExists = await this.User.findOne({ phone: data.phone });
            if (phoneExists) {
                return this.handleResponse(400, "phone already exists");
            }

            // hash password
            data.password = await hash(data.password);

            const user = await this.User.create(data);

            // delete hidden fields
            deleteFields(user["_doc"], this.User.getHiddenFields());

            return this.handleResponse(200, "user registered successfully", user);
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }

    async login({ data }) {
        logger.debug("Logging in user");
        try {
            const user = await this.User.findOne(
                {
                    username: data.username,
                },
                "+password",
            );

            if (!user) {
                return this.handleResponse(400, "invalid email or password");
            }

            // verify password
            const passwordMatch = await verifyHash(user.password, data.password);

            if (!passwordMatch) {
                return this.handleResponse(400, "invalid email or password");
            }

            // generate jwt token
            const token = await generateJwtToken({ ...user["_doc"] });

            // delete hidden fields
            deleteFields(user["_doc"], this.User.getHiddenFields());

            return this.handleResponse(200, "login successful", { user, token });
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }
}

export default AuthController;
