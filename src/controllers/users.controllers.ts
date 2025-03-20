import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/users.services'

export class UserController {
  private userService = new UserService()

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.register(req.body)
      res.status(201).json({ message: 'User registered successfully', user })
    } catch (error) {
      next(error)
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body
      const data = await this.userService.login(email, password)
      res.status(200).json({ message: 'Login successful', ...data })
    } catch (error) {
      next(error)
    }
  }

  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params
      const user = await this.userService.verifyEmail(token)
      res.status(200).json({ message: 'Email verified successfully', user })
    } catch (error) {
      next(error)
    }
  }

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body
      await this.userService.forgotPassword(email)
      res.status(200).json({ message: 'Password reset email sent' })
    } catch (error) {
      next(error)
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params
      const { newPassword } = req.body
      const user = await this.userService.resetPassword(token, newPassword)
      res.status(200).json({ message: 'Password reset successful', user })
    } catch (error) {
      next(error)
    }
  }

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body
      const tokens = await this.userService.refreshToken(refreshToken)
      res.status(200).json({ message: 'Token refreshed', ...tokens })
    } catch (error) {
      next(error)
    }
  }
}
