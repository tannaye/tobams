import { Validation } from "../index.js";

export class AuthValidator extends Validation {
    constructor() {
        super();
    }

    registerValidationRule() {
        return {
            first_name: "required|string",
            last_name: "required|string",
            email: "required|string|email",
            username: "required|string",
            phone: "required|string",
            password: "required|string",
        };
    }

    loginValidationRule() {
        return {
            username: "required|string",
            password: "required|string",
        };
    }

    register() {
        return (req, res, next) => {
            const validationRules = this.registerValidationRule();
            this.validator(req.body, validationRules, {}, (err, status) => {
                if (!status) {
                    this.sendError(res, err);
                } else {
                    next();
                }
            });
        };
    }

    login() {
        return (req, res, next) => {
            const validationRules = this.loginValidationRule();
            this.validator(req.body, validationRules, {}, (err, status) => {
                if (!status) {
                    this.sendError(res, err);
                } else {
                    next();
                }
            });
        };
    }
}

export default new AuthValidator();
