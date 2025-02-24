import mongoose, { Schema, Document } from "mongoose";
export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    subscription: mongoose.Types.ObjectId;
    amount: number;
    status: "pending" | "completed" | "failed";
    paymentId?: string;
    createdAt: Date;
  }
  
  const OrderSchema: Schema = new Schema<IOrder>(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: true },
      amount: { type: Number, required: true },
      status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
      paymentId: { type: String },
    },
    { timestamps: true }
  );
  
  export default mongoose.model<IOrder>("Order", OrderSchema);
  