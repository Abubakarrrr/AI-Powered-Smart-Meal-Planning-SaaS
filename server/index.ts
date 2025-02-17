import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config();

dotenv.config({path:"./.env"});

const MONGO_URI = process.env.MONGO_URI || "";
// Initialize Express
const app = express();

// Connect to MongoDB
connectDB(MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
