import { Request, Response } from "express";
import User from "../models/users";
import { createToken, verifyToken } from "../utils/tokens";
import { sendVerificationEmail, sendPasswordResetEmail, sendEmailConfirmationSuccess, sendPasswordResetSuccess,sendPasswordChangedSuccess } from "../utils/emails";


// Register User
export const register = async (req: Request, res: Response) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
        first_name,
        last_name,
        email,
        password
    });
    const savedUser = await newUser.save();
    const token = createToken({ id: savedUser._id });
    sendVerificationEmail(savedUser.email, token);
    return res.status(201).json({ message: "User created successfully" });
}


// Login User
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken({ id: user._id });
    return res.status(200).json({ token });
}

// Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) {
        return res.status(400).json({ message: "Invalid token" });
    }
    const payload: any = verifyToken(token);
    if (!payload) {
        return res.status(400).json({ message: "Invalid token" });
    }   
    const user = await User.findById(payload.id);
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
    }
    user.isVerified = true;
    await user.save();
    sendEmailConfirmationSuccess(user.email);    
    return res.status(200).json({ message: "Email verified successfully" });
}


// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const token = createToken({ id: user.id });
    sendPasswordResetEmail(user.email, token);
    return res.status(200).json({ message: "Password reset link sent to your email" });
}   


// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
    const {password} = req.body;
    const {token} = req.params;

    if (!password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const payload: any = verifyToken(token);
    if (!payload) {
        return res.status(400).json({ message: "Invalid token" });
    }
    const user = await User.findById(payload.id);
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    user.password = password;
    await user.save();
    sendPasswordResetSuccess(user.email);
    return res.status(200).json({ message: "Password reset successfully" });
}

interface UserRequest extends Request {
    user?: any
}

// Change Password
 export const changePassword = async (req: UserRequest, res: Response) => {
     const { oldPassword, newPassword } = req.body;
     
     if (!oldPassword || !newPassword) {
         return res.status(400).json({ message: "All fields are required" });
     }
 
     try {
         const user = await User.findById(req.user.id);
 
         if (!user) {
             return res.status(400).json({ message: "User not found" });
         }
 
         const isMatch = await user.matchPassword(oldPassword);
 
         if (!isMatch) {
             return res.status(400).json({ message: "Invalid credentials" });
         }
 
         user.password = newPassword;
         await user.save();
         sendPasswordChangedSuccess(user.email);
         
         return res.status(200).json({ message: "Password changed successfully" });
     } catch (error) {
         return res.status(500).json({ message: "Internal server error" });
     }
 };