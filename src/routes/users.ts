import { Router } from 'express';
import { register,verifyEmail,login,forgotPassword,resetPassword,changePassword } from '../controllers/users'

const router =  Router();

router.post('/register',register);
router.get('/verify-email/:token',verifyEmail);
router.post('/login',login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token',resetPassword);
router.post('/change-password',changePassword);

export default router;