import jwt from "jsonwebtoken";
import { Response } from "express";
import mongoose from "mongoose";
import User from "@models/UserModal"

const generateTokenAndSetCookie = async (res: Response, userId: mongoose.Types.ObjectId) => {
  // Generate Access Token (Short-lived)
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "15m" });

  // Generate Refresh Token (Long-lived)
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
  await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });

  // Set Refresh Token in HTTP-only Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents JavaScript access (protects from XSS attacks)
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  });

  return accessToken;
};

export default generateTokenAndSetCookie;
