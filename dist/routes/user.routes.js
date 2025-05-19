"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const user_services_1 = require("../services/user.services");
const emails_1 = __importDefault(require("../utils/emails"));
const user_model_1 = require("../models/user.model");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const emailService = new emails_1.default();
const userService = new user_services_1.UserService(user_model_1.User, emailService);
const userController = new user_controllers_1.UserController(userService);
router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/verify/:token", userController.verifyEmail.bind(userController));
router.post("/forgot-password", userController.forgotPassword.bind(userController));
router.post("/reset-password/:token", userController.resetPassword.bind(userController));
router.post("/refresh-token", authMiddleware_1.authMiddleware, userController.refreshToken.bind(userController));
router.post("/change-password", authMiddleware_1.authMiddleware, userController.changePassword.bind(userController));
exports.default = router;
//# sourceMappingURL=user.routes.js.map