import mongoose, { Schema, Document } from "mongoose";

interface ISubscription extends Document {
  userId: Schema.Types.ObjectId;
  stripeSubscriptionId: string;
  status: string;
  planId: string;
  current_period_start: Date;
  current_period_end: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stripeSubscriptionId: { type: String, required: true },
  status: { type: String, required: true, enum: ["active", "canceled", "past_due", "trialing", "unpaid"] },
  planId: { type: String, required: true },
  current_period_start: { type: Date, required: true },
  current_period_end: { type: Date, required: true },
});

export default mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
