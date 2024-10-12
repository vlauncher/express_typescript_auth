import mongoose, { Document, Schema } from "mongoose";
import Profile from "./profile";
import bcrypt from "bcryptjs";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isVerified: boolean;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (this: IUser, enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.post<IUser>("save", async function (this: IUser) {
    const profile = new Profile({ user: this._id });
    await profile.save();
})



const User = mongoose.model<IUser>("User", UserSchema);

export default User;
