import axios from "axios";
import { headerConfig } from "../../helpers/index.js";

export const sendTextMessage = async ({ body, to, from }, { api_key, sender_name }) => {
    try {
        const url = "https://app.multitexter.com/v2/app/sendsms";
        const data = {
            sender_name: from || sender_name,
            recipients: to,
            message: body,
        };

        const res = await axios.post(url, data, headerConfig(api_key));
        console.log(res.data);
    } catch (e) {
        console.log(e);
    }
};

export default { sendTextMessage };
