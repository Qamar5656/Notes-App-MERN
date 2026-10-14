import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
console.log('mongodb url is ', process.env.MONGO_URL)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting mongodb server ", error);
  }
};
export default connectDB;
