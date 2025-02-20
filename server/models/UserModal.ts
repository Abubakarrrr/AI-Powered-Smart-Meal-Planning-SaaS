import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string | null;
  role: "user" | "nutritionist" | "admin";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
  isVerified: Boolean;
  generateAccessToken(): string;
  generateRefreshToken(): string;
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
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );
  return accessToken;
};
UserSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "30d" }
  );
  return refreshToken;
};

export default mongoose.model<IUser>("User", UserSchema);
