import logger from "../../helpers/logger.js";
import handleResponse from "../../helpers/response.js";
import { tokenVerifier } from "../../helpers/jwt.js";
import { User } from "../../database/index.js";

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return handleResponse(401, "authorization not provided", null, res);
        }

        if (authHeader.split(" ")[0] !== "Token" && authHeader.split(" ")[0] !== "Bearer") {
            return handleResponse(401, "Access denied! No token provided", null, res);
        }

        const token = authHeader.split(" ")[1];

        let decodedToken;
        try {
            decodedToken = await tokenVerifier(token);
        } catch (e) {
            logger.error("🔥 error: %o", e);
            return handleResponse(401, "Access denied! Invalid token", null, res);
        }

        if (!decodedToken) {
            return handleResponse(401, "Access denied! Invalid token", null, res);
        }

        if (!decodedToken.data._id) {
            return res.status(401).json({
                error: "true",
                message: "token expired",
            });
        }

        const user = await User.findOne(
            {
                _id: decodedToken.data._id,
            },
            "+password",
        );

        if (!user) {
            return handleResponse(401, "Access denied! Invalid token", null, res);
        }

        req.user = user["_doc"];
        next();
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return handleResponse(500, "failed to validate request", null, res);
    }
};

export default auth;
