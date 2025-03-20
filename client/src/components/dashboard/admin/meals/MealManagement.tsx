import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { MealCard } from "./MealCard";
import { Button } from "@/components/ui/button";
import { type Meal } from "./type";
import { Schema } from "mongoose";
import { useToast } from "@/hooks/use-toast";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function MealsManagement() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const {toast} =useToast();
  
  useEffect(() => {
    fetchMeals()
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/meal/v1/get-all-meals`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (data) {
        console.log(data.meals);
        setMeals(data.meals);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async(id: Schema.Types.ObjectId) => {
    
    try {
      const response = await fetch(`${BASE_URL}/api/meal/v1/delete-admin-meal/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title:"Success",
          description:"Meal delete successfully.",
        });
        setMeals(meals.filter((meal) => meal._id !== id));
      } else {
        toast({
          title: "Error",
          description: responseData.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to process request" });
    }
  };

  

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Meals Management</h1>
        <Button asChild>
          <Link to="/admin/meals/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Meal
          </Link>
        </Button>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-xl font-medium mb-2">No meals found</h2>
          <p className="text-muted-foreground mb-4">
            Add meals to get started
          </p>
          <Button asChild>
            <Link to="/admin/meals/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCard key={meal.title} meal={meal} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
