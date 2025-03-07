import { useState, useEffect } from "react";
import MealCard from "./MealCard";
import { Schema } from "mongoose";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { mealTypes, mealCategories } from "@/types";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface Meal {
  _id: Schema.Types.ObjectId;
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

export default function MealsList() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Number of meals per page

  const navigate = useNavigate();
  const location = useLocation(); // To get the current URL and query params

  // On component mount, read filters from URL and set states
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageParam = queryParams.get("page") || "1";
    const mealTypeParam = queryParams.get("mealType");
    const categoryParam = queryParams.get("category");

    setCurrentPage(parseInt(pageParam)); // Set the current page
    if (mealTypeParam) setSelectedMealType(mealTypeParam);
    if (categoryParam) setSelectedCategory(categoryParam);

    fetchMeals(pageParam, mealTypeParam, categoryParam);
  }, [location.search]); // Runs when query params change

  // Fetch meals based on filters and pagination
  const fetchMeals = async (
    page: string,
    mealType: string | null,
    category: string | null
  ) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit.toString());

      if (mealType) queryParams.append("mealType", mealType);
      if (category) queryParams.append("category", category);

      const url = `${BASE_URL}/api/meal/v1/get-all-meals?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data) {
        setMeals(data.meals);
        setTotalPages(data.totalPages); // Set total pages for pagination
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Sync URL with selected filters and page number
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (selectedMealType) params.set("mealType", selectedMealType);
    if (selectedCategory) params.set("category", selectedCategory);

    navigate({
      pathname: "/meals",
      search: params.toString(), // Updates the query params
    });
  }, [currentPage, selectedMealType, selectedCategory, navigate]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter change
  const handleFilterChange = (filterType: "mealType" | "category", value: string) => {
    if (filterType === "mealType") {
      setSelectedMealType(value);
    } else if (filterType === "category") {
      setSelectedCategory(value);
    }
    setCurrentPage(1); // Reset to first page when filter changes
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
      <div className="flex flex-col justify-end md:flex-row gap-4 mb-8">
        {/* Meal Type Filter */}
        <div className="flex flex-col gap-1 items-center">
          <label className="text-sm font-medium">Meal Type</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-42 justify-between">
                {selectedMealType ? selectedMealType : "Select Meal Type"}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-42">
              {mealTypes.map((type) => (
                <DropdownMenuItem 
                  key={type}
                  onClick={() => handleFilterChange("mealType", type)}
                >  
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Meal Category Filter */}
        <div className="flex flex-col items-center gap-1">
          <label className="text-sm font-medium">Meal Category</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-42 justify-between">
                {selectedCategory ? selectedCategory : "Select Meal Category"}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-42">
              {mealCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => handleFilterChange("category", category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {meals.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">No meals found</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <MealCard key={meal._id.toString()} meal={meal} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-8">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="my-auto">{currentPage}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >   
          Next
        </Button>
      </div>
    </div>
  );
}
