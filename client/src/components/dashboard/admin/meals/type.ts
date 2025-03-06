export enum MealType {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
}

export interface Meal {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  category: string;
  calories: number;
  mealType: MealType;
}
