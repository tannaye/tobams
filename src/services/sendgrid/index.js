import { MailService } from "@sendgrid/mail";

export const sendEmailTemplate = async (
    { emails, template, template_data },
    { api_key, sender_identity, template_id },
) => {
    const mailSes = new MailService();
    mailSes.setApiKey(api_key);
    const msg = {
        to: emails,
        from: sender_identity,
        // subject: data.subject,
        templateId: template || template_id,
        dynamic_template_data: template_data,
    };

    mailSes
        .send(msg, true)
        .then(response => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        })
        .catch(error => {
            console.error(error);
        });
};

export const sendEmail = async ({ emails, subject, text, html }, { api_key, sender_identity }) => {
    const mailSes = new MailService();
    mailSes.setApiKey(api_key);
    const msg = {
        to: emails,
        from: sender_identity,
        subject: subject,
        text: text,
        html: html,
    };
    mailSes
        .send(msg, true)
        .then(response => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        })
        .catch(error => {
            console.error(error);
        });
};

export default { sendEmailTemplate, sendEmail };
