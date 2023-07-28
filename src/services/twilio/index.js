import twilio from "twilio";

export const sendTextMessage = async ({ body, to, from }, { account_sid, auth_token, twilio_number }) => {
    try {
        const client = new twilio.Twilio(account_sid, auth_token);
        client.messages
            .create({
                body: body,
                to: to,
                from: from || twilio_number,
            })
            .then(message => {
                console.log(message);
            })
            .catch(error => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
};

export default { sendTextMessage };
