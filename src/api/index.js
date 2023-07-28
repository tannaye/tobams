import { Router } from "express";
import authRoutes from "./routes/user/auth.js";
import dashboardRoutes from "./routes/user/dashboard.js";

export default () => {
    const app = Router();

    authRoutes(app);
    dashboardRoutes(app);

    return app;
};
