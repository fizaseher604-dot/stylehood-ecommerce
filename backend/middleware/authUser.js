import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized, Login Again"
            });
        }

        const token_decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const userId = token_decode.id || token_decode.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID missing in token. Please login again."
            });
        }

        // Confirm the user still exists
        const user = await userModel.findById(userId).select(
            "passwordChangedAt"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again."
            });
        }

        // Reject tokens created before the password was changed
        if (user.passwordChangedAt) {
            const changedAtTimestamp = Math.floor(
                user.passwordChangedAt.getTime() / 1000
            );

            if (token_decode.iat < changedAtTimestamp) {
                return res.status(401).json({
                    success: false,
                    message: "Password changed. Please login again."
                });
            }
        }

        req.body.userId = userId;

        next();
    } catch (error) {
        console.log("Auth Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again."
        });
    }
};

export default authUser;