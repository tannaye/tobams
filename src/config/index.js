import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let envFound;
if (process.env.NODE_ENV !== "prod") {
    envFound = dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });
}

export const port = parseInt(process.env.PORT, 10) || 3000;
export const databaseURL = process.env.MONGODB_URI;
export const jwtSecret = process.env.JWT_SECRET;
export const cryptoCode = process.env.CRYPTO_CODE;
export const awsSecreteKey = process.env.AWS_SECRET_KEY;
export const awsAccessKey = process.env.AWS_ACCESS_KEY;
export const baseUrl = process.env.BASE_URL;
export const awsBucket = process.env.AWS_BUCKET;
export const awsRegion = process.env.AWS_REGION;

export default {
    port: parseInt(process.env.PORT, 10) || 8001,
    databaseURL: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    cryptoCode: process.env.CRYPTO_CODE,
    awsSecreteKey: process.env.AWS_SECRET_KEY,
    awsAccessKey: process.env.AWS_ACCESS_KEY,
    awsBucket: process.env.AWS_BUCKET,
    awsRegion: process.env.AWS_REGION,
    api: {
        prefix: "/api/v1",
    },
};
