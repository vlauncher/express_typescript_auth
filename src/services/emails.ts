import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `http://localhost:8000/verify-email/${token}`;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `<p>Please click the following link to verify your email: <a href="${verificationUrl}">verify email</a></p>`,
  }; 

  return transporter.sendMail(mailOptions);
};

export const sendConfirmationEmail = async (email: any) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Email Verified',
    html: `<p>Your email has been successfully verified.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `http://localhost:8000/reset-password/${token}`;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>Please click the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetConfirmationEmail = async (email: string) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset Successful',
    html: `<p>Your password has been successfully reset.</p>`,
  };

  return transporter.sendMail(mailOptions);
};
