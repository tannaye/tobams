import winston from "winston";
const transports = [];
if (process.env.NODE_ENV !== "dev") {
    transports.push(new winston.transports.Console());
} else {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.splat()),
        }),
    );
}

export default winston.createLogger({
    level: "debug",
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
    ),
    transports,
});
