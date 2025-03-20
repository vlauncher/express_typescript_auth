import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
  verified: boolean
  comparePassword: (candidatePassword: string) => Promise<boolean>
  hashPassword: () => Promise<string>
}

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone_number: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Instance method: Compare candidate password with hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Instance method: Hash password before saving/updating
UserSchema.methods.hashPassword = async function (): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(this.password, salt)
}

// Pre-save hook to hash password if modified
UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await this.hashPassword()
  }
  next()
})

export const User = model<IUser>('User', UserSchema)
