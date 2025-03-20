// src/services/profile.services.ts
import { Profile, IProfile } from '../models/profile.model'

export class ProfileService {
  // Retrieve the profile for a given user
  public async getProfile(userId: string): Promise<IProfile> {
    let profile = await Profile.findOne({ user: userId })
    if (!profile) {
      // Optionally create a default profile if not found
      profile = new Profile({ user: userId })
      await profile.save()
    }
    return profile
  }

  // Update the profile for a given user
  public async updateProfile(userId: string, updateData: Partial<IProfile>): Promise<IProfile | null> {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, runValidators: true },
    )
    return updatedProfile
  }
}
