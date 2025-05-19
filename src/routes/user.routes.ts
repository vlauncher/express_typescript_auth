import { Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { UserService } from "../services/user.services";
import EmailService from "../utils/emails";
import { User } from "../models/user.model";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const emailService = new EmailService();
const userService = new UserService(User, emailService);
const userController = new UserController(userService);

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/verify/:token", userController.verifyEmail.bind(userController));
router.post("/forgot-password", userController.forgotPassword.bind(userController));
router.post("/reset-password/:token", userController.resetPassword.bind(userController));
router.post("/refresh-token", authMiddleware, userController.refreshToken.bind(userController));
router.post("/change-password", authMiddleware, userController.changePassword.bind(userController));

export default router;
