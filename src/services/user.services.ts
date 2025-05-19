import { Model } from "mongoose";
import { IUser, User } from "../models/user.model";
import EmailService from "../utils/emails";
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  JwtPayload,
} from "../utils/tokens";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../middlewares/errorHandler";
import { PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE } from "../utils/validations";

export class UserService {
  private UserModel: Model<IUser>;
  private emailService: EmailService;

  constructor(UserModel: Model<IUser>, emailService: EmailService) {
    this.UserModel = UserModel;
    this.emailService = emailService;
  }

  private validatePassword(password: string): void {
    if (!PASSWORD_REGEX.test(password)) {
      throw new BadRequestError(PASSWORD_ERROR_MESSAGE);
    }
  }

  async register(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ): Promise<{ user: Partial<IUser> }> {
    if (await this.UserModel.findOne({ email })) {
      throw new BadRequestError("Email already exists");
    }

    this.validatePassword(password);

    const user: any = new this.UserModel({ first_name, last_name, email, password });
    await user.save();

    const verificationToken = generateToken(user._id.toString());
    await this.emailService.sendEmailVerification(email, verificationToken);

    return {
      user: { id: user._id, first_name, last_name, email, is_active: user.is_active },
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: Partial<IUser>; accessToken: string; refreshToken: string }> {
    const user: any = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.is_active) {
      throw new BadRequestError("Please verify your email before logging in");
    }

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString(), Date.now().toString());

    return {
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_active: user.is_active,
      },
      accessToken,
      refreshToken,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    let payload: JwtPayload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    const user = await this.UserModel.findById(payload.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.is_active) {
      throw new BadRequestError("Email already verified");
    }

    user.is_active = true;
    await user.save({ validateModifiedOnly: true });

    await this.emailService.sendEmailVerificationConfirmation(user.email);
  }

  async forgotPassword(email: string): Promise<void> {
    const user: any = await this.UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const resetToken = generateToken(user._id.toString());
    await this.emailService.sendPasswordReset(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let payload: JwtPayload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      throw new BadRequestError("Invalid or expired reset token");
    }

    const user = await this.UserModel.findById(payload.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    this.validatePassword(newPassword);

    user.password = newPassword;
    await user.save({ validateModifiedOnly: true });

    await this.emailService.sendPasswordResetConfirmation(user.email);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    this.validatePassword(newPassword);

    user.password = newPassword;
    await user.save({ validateModifiedOnly: true });

    await this.emailService.sendPasswordChangeConfirmation(user.email);
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const user: any = await this.UserModel.findById(payload.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const newAccessToken = generateToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString(), Date.now().toString());

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
