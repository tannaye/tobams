import express from "express";
import app from "./app.js";
import logger from "./helpers/logger.js";
import { connection } from "./database/index.js";
import { port } from "./config/index.js";

async function startServer() {
    const expressApp = express();

    await app({ app: expressApp });

    try {
        await connection.connectDB();
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }

    expressApp
        .listen(port, () => {
            logger.info(`
      ################################################
      🪐  Server listening on port: ${port} 🪐
      ################################################
    `);
        })
        .on("error", err => {
            logger.error(err);
            connection.disconnectDB();
            process.exit(1);
        });
}

startServer()
    .then(() => {
        console.log("Server started");
    })
    .catch(err => {
        console.log(err);
    });

process.on("unhandledRejection", (reason, p) => {
    logger.error("Unhandled Rejection at: Promise ", p, reason);
    // application specific logging, throwing an error, or other logic here
});
