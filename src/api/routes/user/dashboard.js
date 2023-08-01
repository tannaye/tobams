import { Router } from "express";
import logger from "../../../helpers/logger.js";
import handleResponse from "../../../helpers/response.js";
import { DashboardController } from "../../../controllers/user/dashboard.js";
import auth from "../../middlewares/auth.js";

const router = Router();

export default app => {
    app.use("/dashboard", router);

    const dashboardController = new DashboardController();

    router.get("/", auth, async (req, res) => {
        try {
            const response = await dashboardController.getDashboard({
                user: req.user,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not get dashboard", null, res);
        }
    });
};
