import mongoose from "mongoose";

// Connect to the MongoDB database.
const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI?.replace(/\/+$/, '')

    if (!mongoUri) {
        throw new Error('MONGODB_URI is not set in the Server/.env file.')
    }

    try {
        await mongoose.connect(`${mongoUri}/lms`)
        console.log('Database Connected')
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`)
        throw error
    }
}

export default connectDB