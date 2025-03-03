import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { Schema } from "mongoose";
const BASE_URL = import.meta.env.VITE_API_URL;

export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snacks = "Snacks",
}

interface Meal {
  _id?:Schema.Types.ObjectId
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: string; 
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType:MealType
}


// Sample meal data
const initialMeals: Meal[] = [
  {
    id: 1,
    type: "Breakfast",
    calories: 130,
    items: [
      {
        id: 1,
        name: "Apple Toast",
        calories: 130,
        quantity: 1,
        serving: "serving",
        image: "https://via.placeholder.com/80",
      },
    ],
  },
  {
    id: 2,
    type: "Lunch",
    calories: 84,
    items: [
      {
        id: 1,
        name: "Spinach and Broccoli Salad",
        calories: 84,
        quantity: 1,
        serving: "serving",
        image: "https://via.placeholder.com/80",
      },
    ],
  },
  {
    id: 3,
    type: "Snack",
    calories: 84,
    items: [
      {
        id: 1,
        name: "Tuna Turmeric Salad",
        calories: 84,
        quantity: 0.5,
        serving: "servings",
        image: "https://via.placeholder.com/80",
      },
    ],
  },
  {
    id: 4,
    type: "Dinner",
    calories: 0,
    items: [],
  },
];

export default function MealPlanner() {
  const { date: urlDate } = useParams();
  const [date, setDate] = useState<Date>(
    urlDate ? parseISO(urlDate) : new Date()
  );
  const [meals, setMeals] = useState<Meal[]>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd");
    navigate(`/planner/${formattedDate}`, { replace: true });
  }, [date]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await fetch(`${BASE_URL}/api/meal/v1/get-datewise-user-meal/date=${formattedDate}`,{
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
        console.log(data.meals);
        setMeals(data.meals);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };
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
              {totalCalories && totalCalories > 0 && (
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
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {meal?.ingredients.map((item) => (
                  <div key={item} className="flex items-center py-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300"
                    />
                    {/* <div className="ml-3 flex-shrink-0">
                      <img
                        src={item|| "/placeholder.svg"}
                        alt={item}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </div> */}
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-blue-600">
                        {item}
                      </div>
                      {/* <div className="flex items-center mt-1">
                        <Input
                          type="number"
                          value={item.quantity}
                          className="w-16 h-8"
                        />
                        <Select defaultValue={item.serving}>
                          <SelectTrigger className="w-28 h-8 ml-2">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="serving">serving</SelectItem>
                            <SelectItem value="servings">servings</SelectItem>
                            <SelectItem value="cup">cup</SelectItem>
                            <SelectItem value="oz">oz</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}
                    </div>
                  </div>
                ))}

                <Button variant="ghost" className="mt-2" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Food
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
