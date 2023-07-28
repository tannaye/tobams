const handleResponse = (
    code,
    message,
    data = null,
    res = null, //response from the router function
) => {
    let stringCode = code.toString();
    let status = stringCode[0] === "2" ? "success" : "error";
    let error = stringCode[0] !== "2";

    if (code[0] === 5) {
        message = `Oops! something went wrong, ${message}.This has been sent to our team.`;
    }
    let response = {
        code,
        status,
        error,
        message,
    };

    if (data) {
        response["data"] = data;
    }

    if (res) {
        return res.status(code).json(response);
    } else {
        return response;
    }
};

export default handleResponse;
