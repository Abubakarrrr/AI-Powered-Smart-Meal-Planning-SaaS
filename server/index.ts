import express from "express";
import dotenv from "dotenv";
import connectDB from "db/db";
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoute from "@routes/api/auth/v1/auth";
import adminRoute from "@routes/api/admin/v1/admin"
import userRoute from "@routes/api/user/v1/user"
import messageRoute from "@routes/api/message/v1/message"
import mealRoute from "@routes/api/meal/v1/meal"
import paymentRoute from "@routes/api/payment/v1/payment"
import config from "@config/config";
import {app,server} from '@lib/socket'
import { webhook } from "@controllers/payment.controller";

dotenv.config();

// const app = express();
const PORT =config.PORT;
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.post("/webhook/stripe", express.raw({ type: "application/json" }),webhook);
app.use(express.json());

app.use("/api/auth/v1", authRoute);
app.use("/api/admin/v1", adminRoute);
app.use("/api/user/v1", userRoute);
app.use("/api/payment/v1", paymentRoute);
app.use("/api/meal/v1", mealRoute);
app.use("/api/messages/v1", messageRoute);


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
