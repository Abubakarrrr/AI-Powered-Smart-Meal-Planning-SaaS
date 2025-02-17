import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "User" | "Nutritionist" | "Admin";
  avatar?: string;
  subscriptions?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, 
    role: { type: String, enum: ["User", "Nutritionist", "Admin"], default: "User" },
    avatar: { type: String },
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
