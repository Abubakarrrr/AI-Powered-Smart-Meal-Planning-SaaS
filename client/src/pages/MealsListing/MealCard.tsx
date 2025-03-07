import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  return (
    <Link to={`/meal/${meal.id}`}>
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={meal.images[0] || "/placeholder.svg"}
            alt={meal.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{meal.title}</h3>
            <Badge variant="outline">{meal.mealType}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{meal.category}</p>
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
    </Link>
  );
}
