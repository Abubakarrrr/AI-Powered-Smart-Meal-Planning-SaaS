import { useState } from "react"
import { Plus } from "lucide-react"
import{ Link} from "react-router-dom"
import { MealCard } from "./MealCard"
import { Button } from "@/components/ui/button"
import { type Meal } from "./type"

export default function MealsManagement() {
  const [meals, setMeals] = useState<Meal[]>([])

  const handleDelete = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Meals Management</h1>
        <Button asChild>
          <Link to="/meals/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Meal
          </Link>
        </Button>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-xl font-medium mb-2">No meals found</h2>
          <p className="text-muted-foreground mb-4">Add your first meal to get started</p>
          <Button asChild>
            <Link to="/meals/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

