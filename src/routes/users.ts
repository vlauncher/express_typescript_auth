import { Router } from "express";
import { register, login, verifyEmail, forgotPassword, resetPassword,changePassword,getProfile,updateProfile } from "../controllers/users";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", protect, changePassword);
router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);


export default router;