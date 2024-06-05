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
exports.changePassword = exports.resetPassword = exports.forgetPassword = exports.login = exports.verifyEmail = exports.register = void 0;
// Register Controller
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: "Register", status: res.status });
});
exports.register = register;
// Verify Email Controller
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: "verify", status: res.status });
});
exports.verifyEmail = verifyEmail;
// Login Controller
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: "Login", status: res.status });
});
exports.login = login;
// Forget Password Controller
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: "Forget Password", status: res.status });
});
exports.forgetPassword = forgetPassword;
// Reset Password Controller
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: "Reset Password", status: res.status });
});
exports.resetPassword = resetPassword;
// Change Password Controller
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: "Change Password", status: res.status });
});
exports.changePassword = changePassword;
