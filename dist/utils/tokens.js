"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
    throw new Error("JWT_SECRET and JWT_SECRET_REFRESH must be defined");
}
const generateToken = (id) => {
    return (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRY ? parseInt(process.env.JWT_TOKEN_EXPIRY) : 7200, // 2 hours in seconds
    });
};
exports.generateToken = generateToken;
const generateRefreshToken = (id, jti) => {
    return (0, jsonwebtoken_1.sign)({ id, jti }, process.env.JWT_SECRET_REFRESH, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY ? parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY) : 2592000, // 30 days in seconds
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET_REFRESH);
    }
    catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=tokens.js.map