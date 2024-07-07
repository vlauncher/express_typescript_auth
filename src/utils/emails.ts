import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_EMAIL_PASSWORD
    }
});

// SendVerificationEmail
export const sendVerificationEmail = async (email: string, token: string) => {
    const url = `http://localhost:8000/auth/verify/${token}`;
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Verify your account",
        html: `
            <h1>Verify your account</h1>
            <p>Please click the following link to verify your account:</p>
            <a href="${url}">${url}</a>
        `
    };
    await transporter.sendMail(mailOptions);
}

// Send Email Confirmation Success
export const sendEmailConfirmationSuccess = async (email: string) => {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Email Confirmation Success",
        html: `
            <h1>Email Confirmation Success</h1>
            <p>Your email has been successfully confirmed.</p>
        `
    };
    await transporter.sendMail(mailOptions);
}   

// Send Password Reset Email
export const sendPasswordResetEmail = async (email: string, token: string) => {
    const url = `http://localhost:8000/auth/reset-password/${token}`;
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Password Reset",
        html: `
            <h1>Password Reset</h1>
            <p>Please click the following link to reset your password:</p>
            <a href="${url}">${url}</a>
        `
    };
    await transporter.sendMail(mailOptions);
}   

// Send Password Reset Success
export const sendPasswordResetSuccess = async (email: string) => {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Password Reset Success",
        html: `
            <h1>Password Reset Success</h1>
            <p>Your password has been successfully reset.</p>
        `
    };
    await transporter.sendMail(mailOptions);
}   

// Send Password Changed Success
export const sendPasswordChangedSuccess = async (email: string) => {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "Password Changed Success",
        html: `
            <h1>Password Changed Success</h1>
            <p>Your password has been successfully changed.</p>
        `
    };
    await transporter.sendMail(mailOptions);
}   