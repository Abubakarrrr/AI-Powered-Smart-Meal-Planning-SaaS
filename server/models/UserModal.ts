import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "nutritionist" | "admin";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "nutritionist", "admin"],
      default: "user",
    },
    avatar: { type: String, default: null },
    refreshToken: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
