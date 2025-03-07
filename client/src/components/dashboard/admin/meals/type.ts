import { Schema } from "mongoose";

export enum MealType {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
}

export interface Meal {
  _id?: Schema.Types.ObjectId;
  title: string;
  description: string;
  ingredients: string[];
  category: string;
  calories: number;
  mealType: MealType;
}
