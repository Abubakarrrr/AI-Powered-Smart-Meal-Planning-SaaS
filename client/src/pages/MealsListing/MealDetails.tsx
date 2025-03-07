import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft } from "lucide-react";

export interface Meal {
  id: number;
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
export default function MealDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>({
    id: 1,
    title: "Grilled Salmon with Asparagus",
    description:
      "A delicious and healthy meal featuring grilled salmon fillet served with fresh asparagus and lemon.",
    category: "Seafood",
    mealType: "Dinner",
    calories: 420,
    protein: 38,
    carbs: 12,
    fats: 25,
    ingredients: [
      "Salmon fillet",
      "Asparagus",
      "Olive oil",
      "Lemon",
      "Garlic",
      "Salt",
      "Black pepper",
      "Dill",
    ],
    steps: [
      "Preheat grill to medium-high heat.",
      "Season salmon with salt, pepper, and dill.",
      "Trim asparagus and toss with olive oil, salt, and pepper.",
      "Grill salmon for 4-5 minutes per side until cooked through.",
      "Grill asparagus for 3-4 minutes, turning occasionally.",
      "Serve with fresh lemon wedges.",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id) return;

      try {
        // const data = await getMealById(Number.parseInt(id))
        // setMeal(data);
      } catch (error) {
        console.error("Error fetching meal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Meal not found</h2>
        <Button onClick={() => navigate("/")}>Back to Meals</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-6 pl-0 flex items-center gap-2"
        onClick={() => navigate("/")}
      >
        <ChevronLeft size={16} />
        Back to Meals
      </Button>

      <div className="mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {meal.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${meal.title} - image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{meal.title}</h1>
            <Badge variant="outline" className="text-base px-3 py-1">
              {meal.mealType}
            </Badge>
          </div>
          <p className="text-muted-foreground">{meal.category}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Calories</p>
            <p className="text-xl font-semibold">{meal.calories}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-xl font-semibold">{meal.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Carbs</p>
            <p className="text-xl font-semibold">{meal.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Fats</p>
            <p className="text-xl font-semibold">{meal.fats}g</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <p className="text-muted-foreground">{meal.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="secondary">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Preparation Steps</h2>
          <ol className="list-decimal pl-5 space-y-2">
            {meal.steps.map((step: any, index: any) => (
              <li key={index} className="pl-2">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
