export const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner"];
export const mealCategories = [
  "Keto",
  "Vegetarian",
  "Vegan",
  "Paleo",
  "Low-Carb",
];

interface User {
  _id: string;
  name: string;
  avatar?: string;
}
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  category: "recipe" | "tip" | "question";
  tags: string[];
  likes: string[];
  createdAt: string;
  comments?: Comment[];
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  likes: string[];
  createdAt: string;
}
