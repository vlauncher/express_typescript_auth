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
exports.UserService = void 0;
const users_models_1 = require("../models/users.models");
const tokens_1 = require("../utils/tokens");
const emails_1 = require("../utils/emails");
class UserService {
    // Register a new user
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield users_models_1.User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Email already registered');
            }
            const newUser = new users_models_1.User(userData);
            yield newUser.save();
            // Generate email verification token and send email
            const emailToken = (0, tokens_1.createEmailVerificationToken)({ id: newUser._id, email: newUser.email });
            yield (0, emails_1.sendEmailVerification)(newUser.email, emailToken);
            return newUser;
        });
    }
    // Login a user
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_models_1.User.findOne({ email });
            if (!user) {
                throw new Error('Invalid email or password');
            }
            const isMatch = yield user.comparePassword(password);
            if (!isMatch) {
                throw new Error('Invalid email or password');
            }
            if (!user.verified) {
                throw new Error('Email not verified');
            }
            const payload = { id: user._id, email: user.email };
            const accessToken = (0, tokens_1.createAccessToken)(payload);
            const refreshToken = (0, tokens_1.createRefreshToken)(payload);
            return { user, accessToken, refreshToken };
        });
    }
    // Verify user email
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, tokens_1.verifyToken)(token);
            if (!decoded) {
                throw new Error('Invalid or expired token');
            }
            const user = yield users_models_1.User.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            if (user.verified) {
                throw new Error('Email already verified');
            }
            user.verified = true;
            yield user.save();
            yield (0, emails_1.sendEmailVerificationSuccess)(user.email);
            return user;
        });
    }
    // Handle forgot password process
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_models_1.User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            const resetToken = (0, tokens_1.createEmailVerificationToken)({ id: user._id, email: user.email });
            yield (0, emails_1.sendForgotPasswordEmail)(user.email, resetToken);
        });
    }
    // Reset user password
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, tokens_1.verifyToken)(token);
            if (!decoded) {
                throw new Error('Invalid or expired token');
            }
            const user = yield users_models_1.User.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            // You may include additional validation for the newPassword here
            user.password = newPassword;
            yield user.save();
            yield (0, emails_1.sendResetPasswordConfirmation)(user.email);
            return user;
        });
    }
    // Refresh token to get new access token
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, tokens_1.verifyToken)(refreshToken);
            if (!decoded) {
                throw new Error('Invalid refresh token');
            }
            const user = yield users_models_1.User.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            const payload = { id: user._id, email: user.email };
            const newAccessToken = (0, tokens_1.createAccessToken)(payload);
            const newRefreshToken = (0, tokens_1.createRefreshToken)(payload);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        });
    }
}
exports.UserService = UserService;
