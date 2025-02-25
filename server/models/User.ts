import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import config from "@config/config";

export enum UserStatus {
  VERIFIED = "verified",
  UNVERIFIED = "unverified",
  BLOCKED = "blocked",
  DELETED = "deleted"
}


export interface IUser extends Document {
  name: string;
  email: string;
  password: string | null;
  role: "user" | "nutritionist" | "admin";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
  otp: string | undefined;
  otpExpiresAt: Date | undefined;
  resetPasswordToken: string | undefined;
  resetPasswordExpiresAt: Date | undefined;
  status: UserStatus;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  UserPreferences: mongoose.Types.ObjectId; 
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "nutritionist", "admin"],
      default: "user",
    },
    avatar: { type: String, default: null },
    refreshToken: { type: String },
    otp: { type: String, default: undefined },
    otpExpiresAt: { type: Date, default: undefined },
    resetPasswordToken: { type: String, default: undefined },
    resetPasswordExpiresAt: { type: Date, default: undefined },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.UNVERIFIED },
    UserPreferences: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserPreferences", // Reference to UserPreferences Schema
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    { _id: this._id },
    config.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );
  return accessToken;
};
UserSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id },
    config.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
  return refreshToken;
};

export default mongoose.model<IUser>("User", UserSchema);
