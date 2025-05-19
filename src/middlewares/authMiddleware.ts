import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/tokens";
import { User } from "../models/user.model";
import { UnauthorizedError, BadRequestError } from "./errorHandler";

export interface AuthRequest extends Request {
  user?: any; // Attach user to request
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload: JwtPayload = verifyToken(token);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
