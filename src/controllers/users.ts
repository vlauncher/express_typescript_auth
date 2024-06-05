import { Request,Response } from 'express';


// Register Controller
export const register = async(req:Request,res:Response) => {
    res.json({msg:"Register",status:res.status});
}

// Verify Email Controller
export const verifyEmail = async(req:Request,res:Response) => {
    res.json({msg:"verify",status:res.status});
}

// Login Controller
export const login = async(req:Request,res:Response) => {
    res.json({msg:"Login",status:res.status});
}

// Forget Password Controller
export const forgetPassword = async(req:Request,res:Response) => {
    res.json({msg:"Forget Password",status:res.status});
}

// Reset Password Controller
export const resetPassword = async(req:Request,res:Response) => {
    res.json({msg:"Reset Password",status:res.status});
}

// Change Password Controller
export const changePassword = async(req:Request,res:Response) => {
    res.json({msg:"Change Password",status:res.status});
}