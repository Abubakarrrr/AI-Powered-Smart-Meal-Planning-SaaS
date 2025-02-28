import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
const BASE_URL = import.meta.env.VITE_API_URL;


const mealSchema = z.object({
title: z.string().min(3, "Title must be at least 3 characters"),
description: z.string().min(10, "Description must be at least 10 characters"),
category: z.enum(["Keto", "Vegan", "Low-carb", "High-protein", "Balanced"]),
calories: z.coerce.number().min(1, "Calories must be positive"),
protein: z.coerce.number().min(0),
carbs: z.coerce.number().min(0),
  fats: z.coerce.number().min(0),
  mealType: z.enum(["Breakfast", "Lunch", "Dinner", "Snacks"]),
});

type MealFormData = z.infer<typeof mealSchema>;

export default function MealCreationPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Keto",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealType: "Breakfast",
    },
  });

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [stepInput, setStepInput] = useState("");

  const addIngredient = () => {
    if (inputValue.trim() !== "") {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (stepInput.trim() !== "") {
      setSteps([...steps, stepInput.trim()]);
      setStepInput("");
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const onSubmit = async(data: any) => {
    console.log("Meal Data:", { ...data, ingredients, steps });
    const meal = {...data,ingredients,steps}
     console.log(meal)
    try {
        const res = await fetch(`${BASE_URL}/api/meal/v1/create-meal`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({meal}),
        });
        const data = await res.json();
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    alert("Meal Created Successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Create a Meal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Meal Title</Label>
              <Input {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label>Ingredients</Label>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button type="button" onClick={addIngredient}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {ingredients.map((ingredient, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeIngredient(index)}
                  >
                    {ingredient} ✕
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Steps</Label>
              <div className="flex gap-2">
                <Input
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                />
                <Button type="button" onClick={addStep}>
                  Add
                </Button>
              </div>
              <ul className="list-decimal pl-6 mt-2">
                {steps.map((step, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {step}
                    <Button variant="ghost" onClick={() => removeStep(index)}>
                      ✕
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                onValueChange={(value) =>
                  setValue("category", value as MealFormData["category"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Keto",
                    "Vegan",
                    "Low-carb",
                    "High-protein",
                    "Balanced",
                  ].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Label>Meal Type</Label>{" "}
            <Select
              onValueChange={(value) =>
                setValue("mealType", value as MealFormData["mealType"])
              }
            >
              {" "}
              <SelectTrigger>
                {" "}
                <SelectValue placeholder="Select Meal Type" />{" "}
              </SelectTrigger>{" "}
              <SelectContent>
                {" "}
                {["Breakfast", "Lunch", "Dinner", "Snacks"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}{" "}
              </SelectContent>{" "}
            </Select>
            <Label>Calories</Label>{" "}
            <Input
              type="number"
              placeholder="Calories"
              {...register("calories")}
            />{" "}
            <Label>Protein</Label>{" "}
            <Input
              type="number"
              placeholder="Protein (g)"
              {...register("protein")}
            />{" "}
            <Label>Carbs</Label>{" "}
            <Input
              type="number"
              placeholder="Carbs (g)"
              {...register("carbs")}
            />{" "}
            <Label>Fats</Label>{" "}
            <Input type="number" placeholder="Fats (g)" {...register("fats")} />
            <Button
              type="submit"
              className="w-full  text-white py-2 rounded-md font-semibold"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
