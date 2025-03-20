import mongoose from 'mongoose'


// Connect to MongoDB use NODE_ENV for development or production
export const connectDB = async (): Promise<void> => {
    try {
      let uri = process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI
      await mongoose.connect(uri as string)
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      }
}
