import { Schema, model, Document, Types } from "mongoose";

export interface IUserMeal extends Document {
  user: Types.ObjectId;  
  meal: Types.ObjectId;  
  isLogged: boolean;
  plannedDate:Date; 
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema
const UserMealSchema = new Schema<IUserMeal>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    meal: { type: Schema.Types.ObjectId, ref: "Meal", required: true },
    isLogged: { type: Boolean, default: false },
    plannedDate: { type: Date, required: true },
  },
  { timestamps: true } 
);

// Create the model
const UserMeal = model<IUserMeal>("UserMeal", UserMealSchema);
export default UserMeal;
