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
exports.sendPasswordChangedSuccess = exports.sendPasswordResetSuccess = exports.sendPasswordResetEmail = exports.sendEmailConfirmationSuccess = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_EMAIL_PASSWORD
    }
});
// SendVerificationEmail
const sendVerificationEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `http://localhost:8000/auth/verify/${token}`;
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Verify your account",
        html: `
            <h1>Verify your account</h1>
            <p>Please click the following link to verify your account:</p>
            <a href="${url}">${url}</a>
        `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendVerificationEmail = sendVerificationEmail;
// Send Email Confirmation Success
const sendEmailConfirmationSuccess = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Email Confirmation Success",
        html: `
            <h1>Email Confirmation Success</h1>
            <p>Your email has been successfully confirmed.</p>
        `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEmailConfirmationSuccess = sendEmailConfirmationSuccess;
// Send Password Reset Email
const sendPasswordResetEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `http://localhost:8000/auth/reset-password/${token}`;
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Password Reset",
        html: `
            <h1>Password Reset</h1>
            <p>Please click the following link to reset your password:</p>
            <a href="${url}">${url}</a>
        `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
// Send Password Reset Success
const sendPasswordResetSuccess = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Password Reset Success",
        html: `
            <h1>Password Reset Success</h1>
            <p>Your password has been successfully reset.</p>
        `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendPasswordResetSuccess = sendPasswordResetSuccess;
// Send Password Changed Success
const sendPasswordChangedSuccess = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Password Changed Success",
        html: `
            <h1>Password Changed Success</h1>
            <p>Your password has been successfully changed.</p>
        `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendPasswordChangedSuccess = sendPasswordChangedSuccess;
