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
const users_services_1 = require("../services/users.services");
class UserController {
    constructor() {
        this.userService = new users_services_1.UserService();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.register(req.body);
                res.status(201).json({ message: 'User registered successfully', user });
            }
            catch (error) {
                next(error);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const data = yield this.userService.login(email, password);
                res.status(200).json(Object.assign({ message: 'Login successful' }, data));
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const user = yield this.userService.verifyEmail(token);
                res.status(200).json({ message: 'Email verified successfully', user });
            }
            catch (error) {
                next(error);
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this.userService.forgotPassword(email);
                res.status(200).json({ message: 'Password reset email sent' });
            }
            catch (error) {
                next(error);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const { newPassword } = req.body;
                const user = yield this.userService.resetPassword(token, newPassword);
                res.status(200).json({ message: 'Password reset successful', user });
            }
            catch (error) {
                next(error);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const tokens = yield this.userService.refreshToken(refreshToken);
                res.status(200).json(Object.assign({ message: 'Token refreshed' }, tokens));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
