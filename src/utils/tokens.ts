import { sign, verify } from "jsonwebtoken";

export interface JwtPayload {
    id: string;
    jti?: string;
}

if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
    throw new Error("JWT_SECRET and JWT_SECRET_REFRESH must be defined");
}

export const generateToken = (id: string) => {
    return sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_TOKEN_EXPIRY ? parseInt(process.env.JWT_TOKEN_EXPIRY) : 7200, // 2 hours in seconds
    });
};

export const generateRefreshToken = (id: string, jti: string) => {
    return sign({ id, jti }, process.env.JWT_SECRET_REFRESH!, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY ? parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY) : 2592000, // 30 days in seconds
    });
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        return verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return verify(token, process.env.JWT_SECRET_REFRESH!) as JwtPayload;
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
};