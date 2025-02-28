import mongoose, { Schema, Document,Types } from "mongoose";

export interface IMeal extends Document {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: string; // e.g., "Keto", "Vegan", "Low-carb"
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt:Date;
  updatedAt:Date;
  createdBy: Types.ObjectId; 
}

const MealSchema: Schema = new Schema<IMeal>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    category: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Meal = mongoose.model<IMeal>("Meal", MealSchema);
