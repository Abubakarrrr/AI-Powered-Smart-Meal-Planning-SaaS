import { useState, useEffect } from "react";
import MealCard from "./MealCard";
const BASE_URL = import.meta.env.VITE_API_URL;

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

const mealsData: Meal[] = [
  {
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
  },
  {
    id: 2,
    title: "Quinoa Buddha Bowl",
    description:
      "A nutritious vegetarian bowl packed with protein-rich quinoa, roasted vegetables, and a tahini dressing.",
    category: "Vegetarian",
    mealType: "Lunch",
    calories: 380,
    protein: 12,
    carbs: 58,
    fats: 14,
    ingredients: [
      "Quinoa",
      "Sweet potato",
      "Chickpeas",
      "Kale",
      "Avocado",
      "Red onion",
      "Tahini",
      "Lemon juice",
      "Maple syrup",
      "Cumin",
    ],
    steps: [
      "Cook quinoa according to package instructions.",
      "Roast sweet potatoes and chickpeas with spices at 400°F for 25 minutes.",
      "Massage kale with olive oil and salt.",
      "Prepare tahini dressing by mixing tahini, lemon juice, maple syrup, and water.",
      "Assemble bowl with quinoa, roasted vegetables, kale, and avocado.",
      "Drizzle with tahini dressing and serve.",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 3,
    title: "Chicken Fajita Bowl",
    description:
      "A flavorful Mexican-inspired bowl with grilled chicken, bell peppers, and all your favorite fajita toppings.",
    category: "Mexican",
    mealType: "Dinner",
    calories: 520,
    protein: 35,
    carbs: 45,
    fats: 22,
    ingredients: [
      "Chicken breast",
      "Bell peppers",
      "Onion",
      "Brown rice",
      "Black beans",
      "Avocado",
      "Lime",
      "Cilantro",
      "Cumin",
      "Chili powder",
      "Greek yogurt",
    ],
    steps: [
      "Season chicken with fajita spices and grill until cooked through.",
      "Sauté sliced bell peppers and onions until tender.",
      "Cook brown rice according to package instructions.",
      "Heat black beans with spices.",
      "Slice avocado and prepare toppings.",
      "Assemble bowl with rice, beans, chicken, vegetables, and toppings.",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 4,
    title: "Overnight Oats with Berries",
    description:
      "A simple make-ahead breakfast with rolled oats, yogurt, and fresh berries that you can prepare the night before.",
    category: "Breakfast",
    mealType: "Breakfast",
    calories: 320,
    protein: 14,
    carbs: 52,
    fats: 8,
    ingredients: [
      "Rolled oats",
      "Greek yogurt",
      "Almond milk",
      "Chia seeds",
      "Honey",
      "Mixed berries",
      "Almond butter",
      "Cinnamon",
    ],
    steps: [
      "Combine oats, yogurt, milk, and chia seeds in a jar.",
      "Add honey and cinnamon and stir well.",
      "Refrigerate overnight or for at least 4 hours.",
      "Top with fresh berries and a dollop of almond butter before serving.",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 5,
    title: "Mediterranean Chickpea Salad",
    description:
      "A refreshing and protein-packed salad with chickpeas, cucumber, tomatoes, and feta cheese in a lemon-herb dressing.",
    category: "Vegetarian",
    mealType: "Lunch",
    calories: 350,
    protein: 15,
    carbs: 42,
    fats: 16,
    ingredients: [
      "Chickpeas",
      "Cucumber",
      "Cherry tomatoes",
      "Red onion",
      "Feta cheese",
      "Kalamata olives",
      "Parsley",
      "Mint",
      "Olive oil",
      "Lemon juice",
      "Garlic",
    ],
    steps: [
      "Rinse and drain chickpeas.",
      "Dice cucumber, halve tomatoes, and thinly slice red onion.",
      "Chop herbs and crumble feta cheese.",
      "Combine all ingredients in a large bowl.",
      "Whisk together olive oil, lemon juice, and minced garlic for dressing.",
      "Toss salad with dressing and serve chilled.",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 6,
    title: "Turkey and Sweet Potato Chili",
    description:
      "A hearty and nutritious chili made with lean ground turkey, sweet potatoes, and beans for a comforting meal.",
    category: "Poultry",
    mealType: "Dinner",
    calories: 410,
    protein: 32,
    carbs: 48,
    fats: 12,
    ingredients: [
      "Ground turkey",
      "Sweet potato",
      "Kidney beans",
      "Black beans",
      "Onion",
      "Bell pepper",
      "Garlic",
      "Tomatoes",
      "Chili powder",
      "Cumin",
      "Paprika",
      "Chicken broth",
    ],
    steps: [
      "Brown ground turkey in a large pot.",
      "Add diced onion, bell pepper, and garlic and sauté until soft.",
      "Add diced sweet potato, beans, tomatoes, and spices.",
      "Pour in chicken broth and bring to a simmer.",
      "Cook for 25-30 minutes until sweet potatoes are tender.",
      "Serve with optional toppings like avocado, Greek yogurt, or cilantro.",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 7,
    title: "Spinach and Mushroom Frittata",
    description:
      "A versatile and protein-rich egg dish loaded with spinach, mushrooms, and cheese that works for any meal of the day.",
    category: "Vegetarian",
    mealType: "Breakfast",
    calories: 280,
    protein: 20,
    carbs: 8,
    fats: 18,
    ingredients: [
      "Eggs",
      "Spinach",
      "Mushrooms",
      "Onion",
      "Garlic",
      "Feta cheese",
      "Milk",
      "Olive oil",
      "Salt",
      "Black pepper",
      "Red pepper flakes",
    ],
    steps: [
      "Preheat oven to 375°F.",
      "Sauté mushrooms, onion, and garlic in an oven-safe skillet.",
      "Add spinach and cook until wilted.",
      "Whisk eggs with milk, salt, and pepper.",
      "Pour egg mixture over vegetables and sprinkle with feta cheese.",
      "Cook on stovetop for 2-3 minutes, then transfer to oven.",
      "Bake for 15-20 minutes until set and golden.",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 8,
    title: "Teriyaki Tofu Stir-Fry",
    description:
      "A flavorful plant-based stir-fry with crispy tofu, colorful vegetables, and a homemade teriyaki sauce.",
    category: "Vegan",
    mealType: "Dinner",
    calories: 340,
    protein: 18,
    carbs: 38,
    fats: 14,
    ingredients: [
      "Extra-firm tofu",
      "Broccoli",
      "Bell pepper",
      "Carrots",
      "Snow peas",
      "Brown rice",
      "Soy sauce",
      "Maple syrup",
      "Rice vinegar",
      "Ginger",
      "Garlic",
      "Cornstarch",
      "Sesame oil",
      "Sesame seeds",
    ],
    steps: [
      "Press and cube tofu, then bake or pan-fry until crispy.",
      "Prepare teriyaki sauce by combining soy sauce, maple syrup, rice vinegar, ginger, garlic, and cornstarch.",
      "Stir-fry vegetables in sesame oil until tender-crisp.",
      "Add tofu and sauce to the pan and cook until sauce thickens.",
      "Serve over brown rice and garnish with sesame seeds.",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
];

export default function MealsList() {
  const [meals, setMeals] = useState<Meal[]>(mealsData);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchMeals();
  }, []);
  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/meal/v1/get-all-meals`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data) {
        console.log(data.meals);
        setMeals(data.meals);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };
 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Meals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
}
