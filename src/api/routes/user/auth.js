import { Router } from "express";
import logger from "../../../helpers/logger.js";
import handleResponse from "../../../helpers/response.js";
import { AuthController } from "../../../controllers/user/auth.js";
import { AuthValidator } from "../../../validations/user/auth.js";

const router = Router();

export default app => {
    app.use("/auth", router);

    const authController = new AuthController();
    const authValidator = new AuthValidator();

    router.post("/register", authValidator.register(), async (req, res) => {
        try {
            const response = await authController.register({
                data: req.body,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not register", null, res);
        }
    });

    router.post("/login", authValidator.login(), async (req, res) => {
        try {
            const response = await authController.login({
                data: req.body,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not login", null, res);
        }
    });
};
