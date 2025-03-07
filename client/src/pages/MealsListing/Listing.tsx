import { useState, useEffect } from "react";
import MealCard from "./MealCard";
import { Schema } from "mongoose";
const BASE_URL = import.meta.env.VITE_API_URL;

export interface Meal {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  steps: string[];
  images: string[];
}


export default function MealsList() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchMeals();
  }, []);
  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/meal/v1/get-all-meals`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data) {
        // console.log(data.meals);
        setMeals(data.meals);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };
 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Meals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <MealCard key={meal.title} meal={meal} />
        ))}
      </div>
    </div>
  );
}
