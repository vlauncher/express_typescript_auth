import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_PASS!,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: `"Express Auth" <${process.env.GMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

export const sendEmailVerification = async (email: string, token: string): Promise<void> => {
  const verifyUrl = `http://localhost:8000/api/v1/auth/verify-email/${token}`
  await sendEmail({
    to: email,
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`,
  })
}

export const sendEmailVerificationSuccess = async (email: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Email Verified',
    html: `<p>Your email has been successfully verified!</p>`,
  })
}

export const sendForgotPasswordEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `http://localhost:8000/api/v1/auth/reset-password/${token}`
  await sendEmail({
    to: email,
    subject: 'Forgot Password',
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  })
}

export const sendResetPasswordConfirmation = async (email: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Password Reset Successful',
    html: `<p>Your password has been reset successfully.</p>`,
  })
}

