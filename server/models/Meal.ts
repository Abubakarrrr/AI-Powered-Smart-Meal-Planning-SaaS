import mongoose, { Schema, Document,Types } from "mongoose";


export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snacks = "Snacks",
}
export interface IMeal extends Document {
  id?:Types.ObjectId
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: string; // e.g., "Keto", "Vegan", "Low-carb"
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType:MealType
  createdAt:Date;
  updatedAt:Date;
  // createdBy: Types.ObjectId; 
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
    mealType:{type: String, enum: Object.values(MealType), required: true },
    // createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Meal = mongoose.model<IMeal>("Meal", MealSchema);
export default Meal
