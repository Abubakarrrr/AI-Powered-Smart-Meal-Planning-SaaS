import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  RotateCcw,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { Schema } from "mongoose";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
const BASE_URL = import.meta.env.VITE_API_URL;

export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snacks = "Snacks",
}

interface Meal {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: MealType;
  isLogged: boolean;
}

export default function MealPlanner() {
  const { toast } = useToast();
  const { date: urlDate } = useParams();
  const [date, setDate] = useState<Date>(
    urlDate ? parseISO(urlDate) : new Date()
  );
  const [meals, setMeals] = useState<Meal[]>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMeals([]);
    const formattedDate = format(date, "yyyy-MM-dd");
    navigate(`/planner/${formattedDate}`, { replace: true });
  }, [date]);

  const fetchMeals = async () => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await fetch(
        `${BASE_URL}/api/meal/v1/get-datewise-user-meal/date=${formattedDate}`,
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
      console.error("Error fetching meals:", error);
    }
  };
  useEffect(() => {
    fetchMeals();
  }, [date]);

  const totalCalories = meals?.reduce((sum, meal) => sum + meal.calories, 0);

  const handlePrevDay = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setIsCalendarOpen(false);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleAddMeal = () => {
    navigate(`/create-meal`, { state: { date: date } });
  };

  const handleEditMeal = (meal: Meal) => {
    navigate(`/create-meal`, { state: { date: date, meal: meal } });
  };

  const handleDeleteMeal = async (mealIdToDelete: Schema.Types.ObjectId) => {
    setMeals(meals?.filter((meal) => meal._id !== mealIdToDelete));
    try {
      const response = await fetch(
        `${BASE_URL}/api/meal/v1/delete-meal/${mealIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Meal deleted successfully",
        });
        setMeals(meals?.filter((meal) => meal._id !== mealIdToDelete));
      } else {
        toast({
          title: "Error",
          description: "Something went wrong!",
        });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to process request" });
    }
  };

  const handleLogMeal = async (
    mealId: Schema.Types.ObjectId,
    isLogged: Boolean
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/meal/v1/log-meal/${mealId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isLogged }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        await fetchMeals()
        toast({
          title: "Success",
          description: isLogged
            ? "Meal has been logged successfully."
            : "Meal has been unlogged successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong!",
        });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to process request" });
    }
  };

  // if(!meals) return <div>Loading...</div>
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="day" className="w-[180px]">
            <TabsList>
              <TabsTrigger value="day" className="flex-1">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="flex-1">
                Week
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="text-xl font-medium ml-2">
              {isToday(date) ? "Today" : format(date, "MMM d, yyyy")}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Meals</h2>
              {totalCalories !== undefined && totalCalories > 0 && (
                <div className="flex items-center ml-4 text-amber-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 mr-1"
                    fill="currentColor"
                  >
                    <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 8h2v2h-2zm0-6h2v4h-2z" />
                  </svg>
                  <span>{totalCalories} Calories</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Button onClick={handleAddMeal}>Create Meal</Button>
              <Button variant="ghost" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {meals?.map((meal) => (
              <div key={meal.title} className="border-t p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">{meal.mealType}</h3>
                    {meal.calories > 0 && (
                      <div className="flex items-center ml-2 text-sm">
                        <div className="h-4 w-4 rounded-full bg-blue-500 mr-1"></div>
                        <span>{meal.calories} Calories</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditMeal(meal)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteMeal(meal._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-blue-600">
                  {meal.title}
                </h2>
                <p className="mt-2 text-gray-700">{meal.description}</p>

                <div className="mt-4 flex space-x-2">
                  <Badge className="bg-blue-100 text-blue-600">
                    {meal.category}
                  </Badge>
                  <Badge className="bg-green-100 text-green-600">
                    {meal.mealType}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2 my-4">
                  <Checkbox
                    className="h-[25px] w-[25px]"
                    checked={meal.isLogged}
                    onCheckedChange={() =>
                      handleLogMeal(meal._id, !meal.isLogged)
                    }
                  />
                  <Label className="cursor-pointer">
                    {meal.isLogged ? "Meal Logged" : "Log Meal"}
                  </Label>
                </div>

                {/* {meal?.ingredients.map((item) => (
                  <div key={item} className="flex items-center py-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300"
                    />
                    <div className="ml-3 flex-shrink-0">
                      <img
                        src={item|| "/placeholder.svg"}
                        alt={item}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </div> 
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-blue-600">{item}</div>
                    </div>
                  </div>
                ))} */}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
