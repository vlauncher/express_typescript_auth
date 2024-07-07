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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.login = exports.register = void 0;
const users_1 = __importDefault(require("../models/users"));
const tokens_1 = require("../utils/tokens");
const emails_1 = require("../utils/emails");
// Register User
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = yield users_1.default.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new users_1.default({
        firstName,
        lastName,
        email,
        password
    });
    const savedUser = yield newUser.save();
    const token = (0, tokens_1.createToken)({ id: savedUser._id });
    (0, emails_1.sendVerificationEmail)(savedUser.email, token);
    return res.status(201).json({ message: "User created successfully" });
});
exports.register = register;
// Login User
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = yield users_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = yield user.matchPassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = (0, tokens_1.createToken)({ id: user._id });
    return res.status(200).json({ token });
});
exports.login = login;
// Verify Email
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    if (!token) {
        return res.status(400).json({ message: "Invalid token" });
    }
    const payload = (0, tokens_1.verifyToken)(token);
    if (!payload) {
        return res.status(400).json({ message: "Invalid token" });
    }
    const user = yield users_1.default.findById(payload.id);
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
    }
    user.isVerified = true;
    yield user.save();
    (0, emails_1.sendEmailConfirmationSuccess)(user.email);
    return res.status(200).json({ message: "Email verified successfully" });
});
exports.verifyEmail = verifyEmail;
// Forgot Password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = yield users_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const token = (0, tokens_1.createToken)({ id: user.id });
    (0, emails_1.sendPasswordResetEmail)(user.email, token);
    return res.status(200).json({ message: "Password reset link sent to your email" });
});
exports.forgotPassword = forgotPassword;
// Reset Password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const { token } = req.params;
    if (!password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const payload = (0, tokens_1.verifyToken)(token);
    if (!payload) {
        return res.status(400).json({ message: "Invalid token" });
    }
    const user = yield users_1.default.findById(payload.id);
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    user.password = password;
    yield user.save();
    (0, emails_1.sendPasswordResetSuccess)(user.email);
    return res.status(200).json({ message: "Password reset successfully" });
});
exports.resetPassword = resetPassword;
// Change Password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = yield users_1.default.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = yield user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        user.password = newPassword;
        yield user.save();
        (0, emails_1.sendPasswordChangedSuccess)(user.email);
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.changePassword = changePassword;
