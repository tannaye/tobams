import aws from "aws-sdk";

export const sendEmail = async ({ emails, subject, text, html }, { access_key, secret_key, region, sender }) => {
    const mailSes = new aws.SES({
        apiVersion: "2010-12-01",
        accessKeyId: access_key,
        secretAccessKey: secret_key,
        region: region,
    });

    const params = {
        Destination: {
            CcAddresses: [],
            ToAddresses: [],
            BccAddresses: emails,
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: html,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: text,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: sender,
    };

    // Create the promise and SES service object
    const sendPromise = mailSes.sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise
        .then(function (data) {
            console.log(data.MessageId);
        })
        .catch(function (err) {
            console.error(err, err.stack);
        });
};

export const sendEmailTemplate = async (
    { emails, template, template_data },
    { access_key, secret_key, region, sender, template_name },
) => {
    const mailSes = new aws.SES({
        apiVersion: "2010-12-01",
        accessKeyId: access_key,
        secretAccessKey: secret_key,
        region: region,
    });

    // Create sendTemplatedEmail params
    const params = {
        Destination: {
            CcAddresses: [],
            ToAddresses: emails,
        },
        Source: sender,
        Template: template || template_name,
        TemplateData: JSON.stringify(template_data),
    };

    // Create the promise and SES service object
    const sendPromise = mailSes.sendTemplatedEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise
        .then(function (data) {
            console.log(data);
        })
        .catch(function (err) {
            console.error(err, err.stack);
        });
};

export default { sendEmail, sendEmailTemplate };
