import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.services";
import { BadRequestError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/authMiddleware";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestError("Valid email is required");
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      throw new BadRequestError("First name, last name, email, and password are required");
    }

    this.validateEmail(email);

    try {
      const result = await this.userService.register(first_name, last_name, email, password);
      res.status(201).json({
        status: "success",
        data: result,
        message: "User registered successfully. Please verify your email.",
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    this.validateEmail(email);

    try {
      const result = await this.userService.login(email, password);
      res.status(200).json({
        status: "success",
        data: result,
        message: "Login successful",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { token } = req.params;

    if (!token) {
      throw new BadRequestError("Verification token is required");
    }

    try {
      await this.userService.verifyEmail(token);
      res.status(200).json({
        status: "success",
        message: "Email verified successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("Email is required");
    }

    this.validateEmail(email);

    try {
      await this.userService.forgotPassword(email);
      res.status(200).json({
        status: "success",
        message: "Password reset email sent",
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { token } = req.params;
    const { password, re_password } = req.body;

    if (!token || !password || !re_password) {
      throw new BadRequestError("Token, password, and re_password are required");
    }

    if (password !== re_password) {
      throw new BadRequestError("Passwords do not match");
    }

    try {
      await this.userService.resetPassword(token, password);
      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const { password, new_password, re_new_password } = req.body;

    if (!password || !new_password || !re_new_password) {
      throw new BadRequestError("Current password, new password, and re_new_password are required");
    }

    if (new_password !== re_new_password) {
      throw new BadRequestError("New passwords do not match");
    }

    try {
      await this.userService.changePassword(req.user._id.toString(), password, new_password);
      res.status(200).json({
        status: "success",
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    try {
      const result = await this.userService.refreshToken(refreshToken);
      res.status(200).json({
        status: "success",
        data: result,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
