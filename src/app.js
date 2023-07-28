import express from "express";
import cors from "cors";
// import { OpticMiddleware } from "@useoptic/express-middleware";
import routes from "./api/index.js";
import config from "./config/index.js";
// import methodOverride from "method-override";

export default ({ app }) => {
    /**
     * Health Check endpoints
     * @TODO Explain why they are here
     */
    app.get("/", (req, res) => {
        res.json({ message: "node js boiler plate", error: false });
    });

    app.get("/status", (req, res) => {
        res.status(200).end();
    });

    app.head("/status", (req, res) => {
        res.status(200).end();
    });

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc.)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable("trust proxy");

    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // Some sauce that always add since 2014
    // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
    // Maybe not needed anymore ?
    // app.use(methodOverride());

    // Transforms the raw string of req.body into json
    app.use(express.json());

    // Load API routes
    app.use(config.api.prefix, routes());

    // API Documentation
    // app.use(
    //     OpticMiddleware({
    //         enabled: process.env.NODE_ENV !== "production",
    //     }),
    // );

    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error("Not Found");
        err["status"] = 404;
        res.status(404).json({
            message: "Not Found",
            error: true,
        });
    });
};
