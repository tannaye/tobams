import axios from "axios";

export const sendTextMessage = async ({ body, to, from }, { api_key, sender }) => {
    try {
        const url = "https://api.ng.termii.com/api/sms/send";
        const data = {
            from: from || sender,
            to: to,
            sms: body,
            type: "plain",
            channel: "generic", //@TODO: make this dnd
            api_key: api_key,
        };

        const res = await axios.post(url, data);
        console.log(res.data);
    } catch (e) {
        console.log(e.response.data);
    }
};
