import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
        throw new Error('MONGODB_URI is not configured')
    }

    mongoose.connection.on("connected", () => {
        console.log("Database Connected");
    });

    const options = process.env.MONGODB_DB ? { dbName: process.env.MONGODB_DB } : {};
    await mongoose.connect(mongoUri, options);
};

export default connectDB;