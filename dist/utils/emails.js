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
exports.sendResetPasswordConfirmation = exports.sendForgotPasswordEmail = exports.sendEmailVerificationSuccess = exports.sendEmailVerification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: `"Express Auth" <${process.env.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
});
const sendEmailVerification = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyUrl = `http://localhost:8000/api/v1/auth/verify-email/${token}`;
    yield sendEmail({
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`,
    });
});
exports.sendEmailVerification = sendEmailVerification;
const sendEmailVerificationSuccess = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendEmail({
        to: email,
        subject: 'Email Verified',
        html: `<p>Your email has been successfully verified!</p>`,
    });
});
exports.sendEmailVerificationSuccess = sendEmailVerificationSuccess;
const sendForgotPasswordEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `http://localhost:8000/api/v1/auth/reset-password/${token}`;
    yield sendEmail({
        to: email,
        subject: 'Forgot Password',
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
});
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
const sendResetPasswordConfirmation = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendEmail({
        to: email,
        subject: 'Password Reset Successful',
        html: `<p>Your password has been reset successfully.</p>`,
    });
});
exports.sendResetPasswordConfirmation = sendResetPasswordConfirmation;
