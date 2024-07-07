import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokens";
import User from "../models/users";

interface UserRequest extends Request {
    user?: any
}

export const protect = async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded: any = verifyToken(token);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Not authorized, no user" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
};