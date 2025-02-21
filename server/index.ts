import express from "express";
import dotenv from "dotenv";
import connectDB from "@config/db";
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoute from "@routes/authRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
