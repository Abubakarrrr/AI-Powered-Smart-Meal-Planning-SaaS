import express from "express";
import dotenv from "dotenv";
import connectDB from "db/db";
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoute from "@routes/api/auth/v1/auth";
import config from "@config/config";
dotenv.config();

const app = express();
const PORT =config.PORT;
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/v1", authRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
