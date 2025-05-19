import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoURI =
        process.env.NODE_ENV === "production"
            ? process.env.MONGO_URI_PROD!
            : process.env.MONGO_URI!;
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
};

