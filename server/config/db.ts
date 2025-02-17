import mongoose from "mongoose";
import dotenv from "dotenv";



const connectDB = async (MONGO_URI:any) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
