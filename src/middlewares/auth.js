import { config } from "dotenv";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
config();

export const protect_user = async (req, res, next) => {
    let token;
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
             message: 'No token provided, authorization denied' 
            });
    }

    try {
        token = auth.split(" ")[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({ 
                message: 'User not found, authorization denied'
             });
        }
        req.user = user;

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
             message: 'Token is not valid, authorization denied'
             });
    }
};
