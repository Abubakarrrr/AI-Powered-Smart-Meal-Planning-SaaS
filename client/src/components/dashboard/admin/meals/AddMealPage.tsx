import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MealType } from "./type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AddMealPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [category, setCategory] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState<MealType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !ingredientsText ||
      !category ||
      !calories ||
      !mealType
    ) {
      return;
    }

    setIsSubmitting(true);

    const ingredients = ingredientsText
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient !== "");

    // In a real app, you would send this data to your API
    const newMeal = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      ingredients,
      category,
      calories: Number.parseInt(calories),
      mealType: mealType as MealType,
    };

    // Simulate API call
    setTimeout(() => {
      navigate("/");
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Meals
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add New Meal</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Meal Details</CardTitle>
            <CardDescription>
              Fill in the details to create a new meal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Meal title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the meal"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Comma-separated list of ingredients"
                required
              />
              <p className="text-sm text-muted-foreground">
                Separate ingredients with commas
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Salad, Dessert"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g., 350"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mealType">Meal Type</Label>
              <Select
                value={mealType}
                onValueChange={(value) => setMealType(value as MealType)}
                required
              >
                <SelectTrigger id="mealType">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MealType.BREAKFAST}>Breakfast</SelectItem>
                  <SelectItem value={MealType.LUNCH}>Lunch</SelectItem>
                  <SelectItem value={MealType.DINNER}>Dinner</SelectItem>
                  <SelectItem value={MealType.SNACK}>Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Meal"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
