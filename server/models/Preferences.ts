import mongoose, { Document, Schema } from "mongoose";

// Enum for Meal Types
export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snacks = "Snacks",
}

// Enum for Time of Day Preferences
export enum TimeOfDay {
  Morning = "Morning",
  Afternoon = "Afternoon",
  Evening = "Evening",
}

// Interface for the Meal Preferences
interface MealPreference {
  mealType: MealType;
  timeOfDay: TimeOfDay;
  calorieLimit: number;
}

// Interface for the User Preferences
interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  dietaryRestrictions: string[];
  preferredCuisines: string[];
  mealPreferences: MealPreference[];
  allergens: string[];
}

// User Preferences Schema
const userPreferencesSchema = new Schema<IUserPreferences>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User Schema
    required: true,
  },
  dietaryRestrictions: {
    type: [String], // E.g., ["Vegetarian", "Gluten-Free", "Vegan"]
    default: [],
  },
  preferredCuisines: {
    type: [String], // E.g., ["Italian", "Indian", "Mexican"]
    default: [],
  },
  mealPreferences: {
    type: [
      {
        mealType: {
          type: String,
          enum: Object.values(MealType), // Restrict to MealType enum
          required: true,
        },
        timeOfDay: {
          type: String,
          enum: Object.values(TimeOfDay), // Restrict to TimeOfDay enum
          required: true,
        },
        calorieLimit: {
          type: Number,
          default: 500,
        },
      },
    ],
    default: [],
  },
  allergens: {
    type: [String], // E.g., ["Peanut", "Dairy", "Eggs"]
    default: [],
  },
});

const UserPreferences = mongoose.model<IUserPreferences>("UserPreferences", userPreferencesSchema);
export default UserPreferences;
