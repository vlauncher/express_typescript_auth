"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;
const createToken = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
exports.createToken = createToken;
const verifyToken = (token) => {
    return (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
