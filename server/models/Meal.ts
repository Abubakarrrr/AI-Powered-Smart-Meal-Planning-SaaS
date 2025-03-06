import mongoose, { Schema, Document, Types } from "mongoose";

export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snacks = "Snacks",
}
export enum CreatedBy {
  Admin = "admin",
  User = "user",
  Nutritionist = "nutritionist",
}

export interface IMeal extends Document {
  id?: Schema.Types.ObjectId;
  title: string;
  images?: string[];
  description: string;
  ingredients: string[];
  steps: string[];
  category: string; // e.g., "Keto", "Vegan", "Low-carb"
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: MealType;
  createdAt: Date;
  updatedAt: Date;
  // isLogged: boolean;
  avatar?: string;
  createdBy: CreatedBy;
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
    // isLogged: { type: Boolean, default: false },
    mealType: { type: String, enum: Object.values(MealType), required: true },
    avatar: { type: String, default: null },
    createdBy: { type: String, enum :Object.values(CreatedBy),required: true },
    images: { type: [String], default: [] },
    // createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Meal = mongoose.model<IMeal>("Meal", MealSchema);
export default Meal;
