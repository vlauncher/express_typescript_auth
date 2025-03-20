import { Request, Response, NextFunction } from 'express'
import { ProfileService } from '../services/profile.services'

interface CustomRequest extends Request {
    user?: any
  }

export class ProfileController {
  private profileService = new ProfileService()

  public getProfile = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id
      const profile = await this.profileService.getProfile(userId)
      res.status(200).json({ message: 'Profile retrieved successfully', profile })
    } catch (error) {
      next(error)
    }
  }

  public updateProfile = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id
      const data = req.body
      const profile = await this.profileService.updateProfile(userId, data)
      res.status(200).json({ message: 'Profile updated successfully', profile })
    } catch (error) {
      next(error)
    }
  }
}

