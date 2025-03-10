import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router";
const BASE_URL = import.meta.env.VITE_API_URL;

export interface Meal {
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
}

const mealSchema = z.object({
  ingredients: z
    .array(z.string())
    .min(1, "At least one ingredient is required"),
  mealType: z.enum(["breakfast", "lunch", "dinner"], {
    required_error: "Meal type is required",
  }),
  calories: z.coerce
    .number()
    .min(5, "Calories must be at least 5")
    .max(200, "Calories cannot exceed 200"),
});

type MealFormValues = z.infer<typeof mealSchema>;

const initialState = [
  {
    title: "Chicken and Cucumber Bites",
    description:
      "A light and refreshing breakfast option featuring small portions of grilled chicken paired with crisp cucumber slices. This is designed to be a very low-calorie option for those needing a tiny boost to start their day.",
    ingredients: [
      "Chicken breast",
      "Cucumber",
      "Lemon juice",
      "Salt",
      "Black pepper",
    ],
    steps: [
      "Grill a small portion of chicken breast until fully cooked.",
      "Dice the chicken into small, bite-sized pieces.",
      "Slice the cucumber into thin rounds.",
      "Arrange the chicken and cucumber slices on a plate.",
      "Drizzle with a touch of lemon juice and season with salt and pepper.",
    ],
    category: "High-Protein, Low-Carb",
    calories: 50,
    protein: 10,
    carbs: 2,
    fats: 1,
    mealType: "breakfast",
  },
  {
    title: "Chicken Broth with Chicken",
    description:
      "Warm and soothing, this chicken broth is a light breakfast option, featuring lean chicken for a protein boost.",
    ingredients: [
      "Chicken Broth",
      "Chicken Breast",
      "Salt",
      "Black Pepper",
      "Green Onions (optional)",
    ],
    steps: [
      "Heat chicken broth in a saucepan.",
      "Finely shred cooked chicken breast.",
      "Add shredded chicken to the broth.",
      "Season with salt and pepper to taste.",
      "Garnish with chopped green onions if desired.",
      "Simmer for 2-3 minutes.",
      "Serve warm.",
    ],
    category: "High-Protein, Low-Carb",
    calories: 50,
    protein: 8,
    carbs: 1,
    fats: 1,
    mealType: "breakfast",
  },
  {
    title: "Chicken and Vegetable Skewers (Small Portion)",
    description:
      "Grilled chicken and vegetable skewers, focusing on minimal calories and maximum flavor, perfect for a light breakfast.",
    ingredients: [
      "Chicken breast",
      "Bell peppers (small amount)",
      "Zucchini (small amount)",
      "Olive oil (very small amount)",
      "Lemon juice",
      "Salt",
      "Black pepper",
    ],
    steps: [
      "Cut chicken breast into small cubes.",
      "Dice bell peppers and zucchini into small pieces.",
      "Thread chicken and vegetables onto skewers.",
      "Brush lightly with olive oil and lemon juice.",
      "Season with salt and pepper.",
      "Grill skewers until chicken is cooked through and vegetables are tender.",
      "Serve immediately.",
    ],
    category: "High-Protein, Low-Carb",
    calories: 50,
    protein: 7,
    carbs: 3,
    fats: 1,
    mealType: "breakfast",
  },
];

export default function PlanWithAI() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [meals, setMeals] = useState<Meal[]>();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMealClick = (meal: Meal) => {
    // If the clicked meal is already selected, deselect it
    if (selectedMeal && selectedMeal.title === meal.title) {
      setSelectedMeal(null);
    } else {
      setSelectedMeal(meal);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
    mode: "onChange",
  });

  const addIngredient = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = event.currentTarget.value.trim();
      if (value && !ingredients.includes(value)) {
        setIngredients((prev) => [...prev, value]);
        setValue("ingredients", [...ingredients, value], {
          shouldValidate: true,
        });
        event.currentTarget.value = "";
      }
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient));
    setValue(
      "ingredients",
      ingredients.filter((item) => item !== ingredient),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: MealFormValues) => {
    console.log("Generating AI meals with:", data);
    try {
      setLoading(true);
      const preferences = data;
      const response = await fetch(`${BASE_URL}/api/meal/v1/fetch-ai-meals`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });
      const apiData = await response.json();
      if (apiData) {
        console.log(apiData.recommendation);
        setMeals(apiData.recommendation);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch AI meals",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeal = async () => {
    if (!selectedDate) {
      alert("Please select a date before scheduling.");
      return;
    }
    const formattedDate = selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : "";
    if (!selectedMeal) {
      alert("Please select a meal before scheduling.");
      return;
    }
    const mealData = { ...selectedMeal, date: selectedDate };
    try {
      const response = await fetch(`${BASE_URL}/api/meal/v1/create-meal`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });
      const responseData = await response.json();
      console.log(responseData)
      if (response.ok) {
        toast({
          title: "Created Successfully",
          description: "Meal created successfully.",
        });
        navigate(`/planner/${formattedDate}`);
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

    console.log("Meal scheduled on:", selectedDate);
    // Add API call to schedule the meal with `selectedDate`
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Plan with AI</h1>

      <div>
        <label className="block font-medium">Ingredients</label>
        <Input
          type="text"
          placeholder="Type an ingredient and press Enter"
          onKeyDown={addIngredient}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {ingredients.map((ing) => (
            <Badge
              key={ing}
              variant="outline"
              onClick={() => removeIngredient(ing)}
              className="cursor-pointer"
            >
              {ing} ✕
            </Badge>
          ))}
        </div>
        {errors.ingredients && (
          <p className="text-red-500 text-sm">{errors.ingredients.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Meal Type</label>
        <Select
          onValueChange={(val) =>
            setValue("mealType", val as MealFormValues["mealType"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            {getValues("mealType") || "Choose a meal type"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
          </SelectContent>
        </Select>
        {errors.mealType && (
          <p className="text-red-500 text-sm">{errors.mealType.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Calorie Intake</label>
        <Input
          type="number"
          placeholder="Enter calories"
          {...register("calories")}
        />
        {errors.calories && (
          <p className="text-red-500 text-sm">{errors.calories.message}</p>
        )}
      </div>

      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid || loading}
        className="w-full"
      >
        Generate with AI
      </Button>

      {meals && meals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mt-4">Recommended Meals</h2>
          <div className="flex justify-end items-center gap-4">
            {/* Date Picker */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon size={16} />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>

            {/* Schedule Meal Button */}
            <Button onClick={handleScheduleMeal}>Schedule Meal</Button>
          </div>
          {meals.map((meal, index) => (
            <Card
              key={index}
              className={`overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedMeal && selectedMeal.title === meal.title
                  ? "bg-blue-100 border-2 border-blue-500"
                  : ""
              }`} // Add custom classes for selected card
              onClick={() => handleMealClick(meal)} // Handle click to select/deselect
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{meal.title}</h3>
                  <Badge variant="outline">{meal.mealType}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    {meal.category}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {meal.calories} calories
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm">
                  <span>{meal.protein}g protein</span>
                  <span>{meal.carbs}g carbs</span>
                  <span>{meal.fats}g fats</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
