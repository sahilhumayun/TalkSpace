import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
       const db = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`MongoDB connected: Successfully`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
}}