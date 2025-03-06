import { useState, useEffect } from "react"
import {Link, useNavigate, useParams} from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { MealType, type Meal } from "./type"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - in a real app, this would come from your API or state management
const mockMeals: Meal[] = [
  {
    id: "1",
    title: "Grilled Chicken Salad",
    description: "A healthy salad with grilled chicken breast, mixed greens, and vinaigrette.",
    ingredients: ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Balsamic vinegar"],
    category: "Salad",
    calories: 350,
    mealType: MealType.LUNCH,
  },
  {
    id: "2",
    title: "Overnight Oats",
    description: "Nutritious breakfast prepared with oats soaked overnight in milk with fruits and nuts.",
    ingredients: ["Rolled oats", "Milk", "Greek yogurt", "Honey", "Chia seeds", "Berries", "Almonds"],
    category: "Breakfast",
    calories: 420,
    mealType: MealType.BREAKFAST,
  },
  {
    id: "3",
    title: "Beef Stir Fry",
    description: "Quick and flavorful beef stir fry with vegetables and soy sauce.",
    ingredients: ["Beef strips", "Bell peppers", "Broccoli", "Carrots", "Soy sauce", "Garlic", "Ginger"],
    category: "Main Course",
    calories: 580,
    mealType: MealType.DINNER,
  },
]

export default function EditMealPage() {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [ingredientsText, setIngredientsText] = useState("")
  const [category, setCategory] = useState("")
  const [calories, setCalories] = useState("")
  const [mealType, setMealType] = useState<MealType | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch the meal data from your API
    const meal = mockMeals.find((meal) => meal.id === id)

    if (meal) {
      setTitle(meal.title)
      setDescription(meal.description)
      setIngredientsText(meal.ingredients.join(", "))
      setCategory(meal.category)
      setCalories(meal.calories.toString())
      setMealType(meal.mealType)
    } else {
      setNotFound(true)
    }

    setIsLoading(false)
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !ingredientsText || !category || !calories || !mealType) {
      return
    }

    setIsSubmitting(true)

    const ingredients = ingredientsText
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient !== "")

    // In a real app, you would send this data to your API
    const updatedMeal = {
      id,
      title,
      description,
      ingredients,
      category,
      calories: Number.parseInt(calories),
      mealType: mealType as MealType,
    }

    // Simulate API call
    setTimeout(() => {
      // Navigate back to the meals list
      navigate("/")
      setIsSubmitting(false)
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading meal data...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Meal Not Found</h1>
        <p className="mb-4">The meal you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/">Back to Meals</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Meals
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Meal</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Meal Details</CardTitle>
            <CardDescription>Update the details of this meal.</CardDescription>
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
              <p className="text-sm text-muted-foreground">Separate ingredients with commas</p>
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
              <Select value={mealType} onValueChange={(value) => setMealType(value as MealType)} required>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

