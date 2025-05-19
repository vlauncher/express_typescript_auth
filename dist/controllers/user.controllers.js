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
exports.UserController = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new errorHandler_1.BadRequestError("Valid email is required");
        }
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { first_name, last_name, email, password } = req.body;
            if (!first_name || !last_name || !email || !password) {
                throw new errorHandler_1.BadRequestError("First name, last name, email, and password are required");
            }
            this.validateEmail(email);
            try {
                const result = yield this.userService.register(first_name, last_name, email, password);
                res.status(201).json({
                    status: "success",
                    data: result,
                    message: "User registered successfully. Please verify your email.",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new errorHandler_1.BadRequestError("Email and password are required");
            }
            this.validateEmail(email);
            try {
                const result = yield this.userService.login(email, password);
                res.status(200).json({
                    status: "success",
                    data: result,
                    message: "Login successful",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            if (!token) {
                throw new errorHandler_1.BadRequestError("Verification token is required");
            }
            try {
                yield this.userService.verifyEmail(token);
                res.status(200).json({
                    status: "success",
                    message: "Email verified successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                throw new errorHandler_1.BadRequestError("Email is required");
            }
            this.validateEmail(email);
            try {
                yield this.userService.forgotPassword(email);
                res.status(200).json({
                    status: "success",
                    message: "Password reset email sent",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const { password, re_password } = req.body;
            if (!token || !password || !re_password) {
                throw new errorHandler_1.BadRequestError("Token, password, and re_password are required");
            }
            if (password !== re_password) {
                throw new errorHandler_1.BadRequestError("Passwords do not match");
            }
            try {
                yield this.userService.resetPassword(token, password);
                res.status(200).json({
                    status: "success",
                    message: "Password reset successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, new_password, re_new_password } = req.body;
            if (!password || !new_password || !re_new_password) {
                throw new errorHandler_1.BadRequestError("Current password, new password, and re_new_password are required");
            }
            if (new_password !== re_new_password) {
                throw new errorHandler_1.BadRequestError("New passwords do not match");
            }
            try {
                yield this.userService.changePassword(req.user._id.toString(), password, new_password);
                res.status(200).json({
                    status: "success",
                    message: "Password changed successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new errorHandler_1.BadRequestError("Refresh token is required");
            }
            try {
                const result = yield this.userService.refreshToken(refreshToken);
                res.status(200).json({
                    status: "success",
                    data: result,
                    message: "Token refreshed successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controllers.js.map