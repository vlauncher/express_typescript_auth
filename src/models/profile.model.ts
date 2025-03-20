// src/models/profile.model.ts
import { Schema, model, Document } from 'mongoose'

export interface IProfile extends Document {
  user: Schema.Types.ObjectId
  bio: string
  age: number
  address: string
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bio: { type: String, default: '' },
    age: { type: Number, default: 0 },
    address: { type: String, default: '' },
  },
  { timestamps: true },
)

export const Profile = model<IProfile>('Profile', ProfileSchema)
