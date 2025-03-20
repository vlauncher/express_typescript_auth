import { User, IUser } from '../models/users.models'
import { createAccessToken, createRefreshToken, createEmailVerificationToken, verifyToken } from '../utils/tokens'
import { sendEmailVerification, sendForgotPasswordEmail, sendResetPasswordConfirmation, sendEmailVerificationSuccess } from '../utils/emails'
import bcrypt from 'bcryptjs'

export class UserService {
  // Register a new user
  public async register(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error('Email already registered')
    }
    const newUser:any = new User(userData)
    await newUser.save()

    // Generate email verification token and send email
    const emailToken = createEmailVerificationToken({ id: newUser._id, email: newUser.email })
    await sendEmailVerification(newUser.email, emailToken)
    return newUser
  }

  // Login a user
  public async login(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('Invalid email or password')
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new Error('Invalid email or password')
    }
    if (!user.verified) {
      throw new Error('Email not verified')
    }
    const payload:any = { id: user._id, email: user.email }
    const accessToken = createAccessToken(payload)
    const refreshToken = createRefreshToken(payload)
    return { user, accessToken, refreshToken }
  }

  // Verify user email
  public async verifyEmail(token: string): Promise<IUser> {
    const decoded = verifyToken<{ id: string; email: string }>(token)
    if (!decoded) {
      throw new Error('Invalid or expired token')
    }
    const user = await User.findById(decoded.id)
    if (!user) {
      throw new Error('User not found')
    }
    if (user.verified) {
      throw new Error('Email already verified')
    }
    user.verified = true
    await user.save()
    await sendEmailVerificationSuccess(user.email)
    return user
  }

  // Handle forgot password process
  public async forgotPassword(email: string): Promise<void> {
    const user:any = await User.findOne({ email })
    if (!user) {
      throw new Error('User not found')
    }
    const resetToken = createEmailVerificationToken({ id: user._id, email: user.email })
    await sendForgotPasswordEmail(user.email, resetToken)
  }

  // Reset user password
  public async resetPassword(token: string, newPassword: string): Promise<IUser> {
    const decoded = verifyToken<{ id: string; email: string }>(token)
    if (!decoded) {
      throw new Error('Invalid or expired token')
    }
    const user = await User.findById(decoded.id)
    if (!user) {
      throw new Error('User not found')
    }
    // You may include additional validation for the newPassword here
    user.password = newPassword
    await user.save()
    await sendResetPasswordConfirmation(user.email)
    return user
  }

  // Refresh token to get new access token
  public async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = verifyToken<{ id: string; email: string }>(refreshToken)
    if (!decoded) {
      throw new Error('Invalid refresh token')
    }
    const user = await User.findById(decoded.id)
    if (!user) {
      throw new Error('User not found')
    }
    const payload:any = { id: user._id, email: user.email }
    const newAccessToken = createAccessToken(payload)
    const newRefreshToken = createRefreshToken(payload)
    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }
}
