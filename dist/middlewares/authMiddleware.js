"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const tokens_1 = require("../utils/tokens");
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("./errorHandler");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new errorHandler_1.UnauthorizedError("No token provided");
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = (0, tokens_1.verifyToken)(token);
        const user = yield user_model_1.User.findById(payload.id).select("-password");
        if (!user) {
            throw new errorHandler_1.UnauthorizedError("User not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new errorHandler_1.UnauthorizedError("Invalid or expired token");
    }
});
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map