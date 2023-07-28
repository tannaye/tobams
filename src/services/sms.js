import { twilio, sns, multitexter, termii } from "./index.js";

export const sendSMS = async ({ body, to, from }, credentials, provider) => {
    switch (provider) {
        case "twilio":
            await twilio.sendTextMessage({ body, to, from }, credentials);
            return {
                error: false,
            };

        case "sns":
            await sns.sendTextMessage({ body, to }, credentials);
            return {
                error: false,
            };

        case "multitexter":
            await multitexter.sendTextMessage({ body, to, from }, credentials);
            return {
                error: false,
            };

        case "termii":
            await termii.sendTextMessage({ body, to, from }, credentials);
            return {
                error: false,
            };
        default:
            return {
                error: true,
                message: "invalid provider provided",
            };
    }
};
