import aws from "aws-sdk";

export const sendTextMessage = async ({ body, to }, { access_key, secret_key, region }) => {
    const mesSes = new aws.SNS({
        accessKeyId: access_key,
        secretAccessKey: secret_key,
        region: region,
        apiVersion: "2010-03-31",
    });

    const params = {
        Message: body,
        PhoneNumber: to,
    };

    const publishTextPromise = mesSes.publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise
        .then(function (data) {
            console.log("MessageID is " + data.MessageId);
        })
        .catch(function (err) {
            console.error(err, err.stack);
        });
};

export default { sendTextMessage };
