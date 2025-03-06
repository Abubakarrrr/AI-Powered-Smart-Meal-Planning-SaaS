import { Edit, Trash2 } from "lucide-react"
import {Link} from "react-router-dom"
import { type Meal, MealType } from "./type"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MealCardProps {
  meal: Meal
  onDelete: (id: string) => void
}

export function MealCard({ meal, onDelete }: MealCardProps) {
  const getMealTypeColor = (mealType: MealType) => {
    switch (mealType) {
      case MealType.BREAKFAST:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case MealType.LUNCH:
        return "bg-green-100 text-green-800 border-green-200"
      case MealType.DINNER:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case MealType.SNACK:
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{meal.title}</CardTitle>
            <CardDescription className="mt-2">{meal.description}</CardDescription>
          </div>
          <Badge className={`ml-2 ${getMealTypeColor(meal.mealType)}`}>{MealType[meal.mealType]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Category</h4>
            <p className="text-sm text-muted-foreground">{meal.category}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Calories</h4>
            <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Ingredients</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/meals/edit/${meal.id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the meal "{meal.title}" from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(meal.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

