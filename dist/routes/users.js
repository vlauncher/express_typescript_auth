"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/register", users_1.register);
router.post("/login", users_1.login);
router.get("/verify/:token", users_1.verifyEmail);
router.post("/forgot-password", users_1.forgotPassword);
router.post("/reset-password/:token", users_1.resetPassword);
router.post("/change-password", auth_1.protect, users_1.changePassword);
exports.default = router;
