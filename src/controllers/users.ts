import { Request,Response } from 'express';
import { User, UserRole } from '../models/users';
import { createToken, verifyToken, createAccessToken, createRefreshToken,createResetToken, verifyResetToken } from '../services/tokens';
import { sendVerificationEmail, sendConfirmationEmail, sendPasswordResetEmail, sendPasswordResetConfirmationEmail } from '../services/emails';
import bcrypt from 'bcryptjs';


// Register Controller
export const register = async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, role } = req.body;
  
    // Validate request
    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
  
      // Create new user
      const user = await User.create({
        first_name: first_name,
        last_name: last_name,
        email,
        password,
        role,
      });
  
      // Send verification email
      await sendVerificationEmail(user.email, createToken(user));
  
      return res.status(201).json({ msg: 'User created successfully', user });
  

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify Email Controller
export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    console.log(token)
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
  
    try {
      const decoded: any = verifyToken(token as string);
      const user = await User.findOne({ where: { email: decoded.user.email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (user.isVerified) {
        return res.status(400).json({ error: 'Email is already verified' });
      }
  
      user.isVerified = true;
      await user.save();
  
      // Send confirmation email
      await sendConfirmationEmail(user.email);
  
      return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

// Login Controller
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    // Validate request
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(400).json({ error: 'Email is not verified' });
      }
  
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
      }
  
      // Create tokens
      const access = createAccessToken({ id: user.id, email: user.email });
      const refresh = createRefreshToken({ id: user.id, email: user.email });
  
      return res.status(200).json({
        access,
        refresh,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Create password reset token
      const resetToken = createResetToken({ id: user.id, email: user.email });
  
      // Send password reset email
      await sendPasswordResetEmail(user.email, resetToken);
  
      return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password,confirm_password } = req.body;
  
    if (!token || !password || !confirm_password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
  
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
  
      // Verify reset token
      const decoded: any = verifyResetToken(token as string);
      const user = await User.findOne({ where: { email: decoded.email } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      
      await user.save();
  
      // Send password reset confirmation email
      await sendPasswordResetConfirmationEmail(user.email);
  
      return res.status(200).json({ message: 'Password reset successfully' });

  };

// Change Password Controller
export const changePassword = async(req:Request,res:Response) => {
    res.json({msg:"Change Password",status:res.status});
}