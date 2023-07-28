import { sendgrid, ses } from "./index.js";

export const sendEmail = async ({ emails, subject, text, html }, credentials, provider) => {
    switch (provider) {
        case "sendgrid":
            await sendgrid.sendEmail({ emails, subject, text, html }, credentials);
            return {
                error: false,
            };
        case "ses":
            await ses.sendEmail({ emails, subject, text, html }, credentials);
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

export const sendEmailTemplate = async ({ emails, template, template_data }, credentials, provider) => {
    switch (provider) {
        case "sendgrid":
            await sendgrid.sendEmailTemplate({ emails, template, template_data }, credentials);
            return {
                error: false,
            };
        case "ses":
            await ses.sendEmailTemplate({ emails, template, template_data }, credentials);
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
