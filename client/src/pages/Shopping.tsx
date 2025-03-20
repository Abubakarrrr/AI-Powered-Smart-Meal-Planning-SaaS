import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function ShoppingList() {
  const [items, setItems] = useState<string[]>([]);

  const fetchShoppingList = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/meal/v1/generate-shopping-list`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const responseData = await response.json();
      if (response.ok) {
        // console.log(responseData.allIngredients)
        setItems(responseData.allIngredients[0])
      } 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
       fetchShoppingList();
  },[])

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Shopping List</h1>

      <div className="space-y-4">
        {items?.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-all duration-200"
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold`}>{item}</h3>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
