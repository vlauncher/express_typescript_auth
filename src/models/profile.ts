import { Document, Schema, Model, model } from "mongoose";
import User from "./users";
import { on } from "events";

interface IProfile extends Document {
    user: string;
    bio: string;
    phone_number: string;
    address: string;
}

const ProfileSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        onDelete: "cascade"
    },
    bio: {
        type: String
    },
    phone_number: {
        type: String
    },
    address: {
        type: String
    }
}); 

const Profile: Model<IProfile> = model<IProfile>("Profile", ProfileSchema);

export default Profile;