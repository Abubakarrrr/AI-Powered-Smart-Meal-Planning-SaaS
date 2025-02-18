import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessToken = (userId: mongoose.Types.ObjectId): string => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
  return accessToken;
};

const generateRefreshToken = (userId: mongoose.Types.ObjectId): string => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
  return refreshToken;
};

export { generateAccessToken, generateRefreshToken };
