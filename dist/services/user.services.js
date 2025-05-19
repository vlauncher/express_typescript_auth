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
const tokens_1 = require("../utils/tokens");
const errorHandler_1 = require("../middlewares/errorHandler");
const validations_1 = require("../utils/validations");
class UserService {
    constructor(UserModel, emailService) {
        this.UserModel = UserModel;
        this.emailService = emailService;
    }
    validatePassword(password) {
        if (!validations_1.PASSWORD_REGEX.test(password)) {
            throw new errorHandler_1.BadRequestError(validations_1.PASSWORD_ERROR_MESSAGE);
        }
    }
    register(first_name, last_name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.UserModel.findOne({ email })) {
                throw new errorHandler_1.BadRequestError("Email already exists");
            }
            this.validatePassword(password);
            const user = new this.UserModel({ first_name, last_name, email, password });
            yield user.save();
            const verificationToken = (0, tokens_1.generateToken)(user._id.toString());
            yield this.emailService.sendEmailVerification(email, verificationToken);
            return {
                user: { id: user._id, first_name, last_name, email, is_active: user.is_active },
            };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserModel.findOne({ email });
            if (!user) {
                throw new errorHandler_1.UnauthorizedError("Invalid email or password");
            }
            const isPasswordValid = yield user.comparePassword(password);
            if (!isPasswordValid) {
                throw new errorHandler_1.UnauthorizedError("Invalid email or password");
            }
            if (!user.is_active) {
                throw new errorHandler_1.BadRequestError("Please verify your email before logging in");
            }
            const accessToken = (0, tokens_1.generateToken)(user._id.toString());
            const refreshToken = (0, tokens_1.generateRefreshToken)(user._id.toString(), Date.now().toString());
            return {
                user: {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    is_active: user.is_active,
                },
                accessToken,
                refreshToken,
            };
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload;
            try {
                payload = (0, tokens_1.verifyToken)(token);
            }
            catch (error) {
                throw new errorHandler_1.BadRequestError("Invalid or expired verification token");
            }
            const user = yield this.UserModel.findById(payload.id);
            if (!user) {
                throw new errorHandler_1.NotFoundError("User not found");
            }
            if (user.is_active) {
                throw new errorHandler_1.BadRequestError("Email already verified");
            }
            user.is_active = true;
            yield user.save({ validateModifiedOnly: true });
            yield this.emailService.sendEmailVerificationConfirmation(user.email);
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserModel.findOne({ email });
            if (!user) {
                throw new errorHandler_1.NotFoundError("User not found");
            }
            const resetToken = (0, tokens_1.generateToken)(user._id.toString());
            yield this.emailService.sendPasswordReset(email, resetToken);
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload;
            try {
                payload = (0, tokens_1.verifyToken)(token);
            }
            catch (error) {
                throw new errorHandler_1.BadRequestError("Invalid or expired reset token");
            }
            const user = yield this.UserModel.findById(payload.id);
            if (!user) {
                throw new errorHandler_1.NotFoundError("User not found");
            }
            this.validatePassword(newPassword);
            user.password = newPassword;
            yield user.save({ validateModifiedOnly: true });
            yield this.emailService.sendPasswordResetConfirmation(user.email);
        });
    }
    changePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserModel.findById(userId);
            if (!user) {
                throw new errorHandler_1.NotFoundError("User not found");
            }
            const isPasswordValid = yield user.comparePassword(currentPassword);
            if (!isPasswordValid) {
                throw new errorHandler_1.UnauthorizedError("Current password is incorrect");
            }
            this.validatePassword(newPassword);
            user.password = newPassword;
            yield user.save({ validateModifiedOnly: true });
            yield this.emailService.sendPasswordChangeConfirmation(user.email);
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload;
            try {
                payload = (0, tokens_1.verifyRefreshToken)(refreshToken);
            }
            catch (error) {
                throw new errorHandler_1.UnauthorizedError("Invalid or expired refresh token");
            }
            const user = yield this.UserModel.findById(payload.id);
            if (!user) {
                throw new errorHandler_1.NotFoundError("User not found");
            }
            const newAccessToken = (0, tokens_1.generateToken)(user._id.toString());
            const newRefreshToken = (0, tokens_1.generateRefreshToken)(user._id.toString(), Date.now().toString());
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.services.js.map