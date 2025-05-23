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
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    sendEmail(to_1, subject_1, content_1) {
        return __awaiter(this, arguments, void 0, function* (to, subject, content, isHtml = false) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                [isHtml ? "html" : "text"]: content,
            };
            try {
                return yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                throw new Error(`Failed to send email: ${error.message}`);
            }
        });
    }
    sendEmailVerification(to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Email Verification";
            const text = `Please verify your email by clicking the link: http://localhost:3000/auth/verify?token=${token}`;
            return yield this.sendEmail(to, subject, text);
        });
    }
    sendEmailVerificationConfirmation(to) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Email Verification Confirmation";
            const text = `Your email has been verified successfully.`;
            return yield this.sendEmail(to, subject, text);
        });
    }
    sendPasswordReset(to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Password Reset";
            const text = `Please reset your password by clicking the link: http://localhost:3000/auth/reset-password?token=${token}`;
            return yield this.sendEmail(to, subject, text);
        });
    }
    sendPasswordResetConfirmation(to) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Password Reset Confirmation";
            const text = `Your password has been reset successfully.`;
            return yield this.sendEmail(to, subject, text);
        });
    }
    sendPasswordChangeConfirmation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transporter.sendMail({
                to: email,
                subject: "Password Change Successful",
                html: `<p>Your password has been successfully changed.</p>`,
            });
        });
    }
}
exports.default = EmailService;
//# sourceMappingURL=emails.js.map