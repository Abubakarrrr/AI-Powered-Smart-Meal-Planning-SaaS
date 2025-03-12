import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const plans = [
  {
    name: "Starter",
    price: "$5/month",
    features: [
      "AI-powered meal planning for 1 day",
      "Basic nutritional insights",
      "Limited meal tracking",
    ],
    buttonText: "Get Started",
    link: "https://buy.stripe.com/test_9AQdUW3ymbeG2Nq6oo",
  },
  {
    name: "Pro",
    price: "$14.99/week",
    features: [
      "AI-powered meal planning for 7 days",
      "Advanced nutritional insights",
      "Full meal tracking & shopping list",
      "Access to community forum",
    ],
    buttonText: "Subscribe Now",
    link: "https://buy.stripe.com/test_28o18aed02IabjWbIJ",
  },
  {
    name: "Premium",
    price: "$29.99/month",
    features: [
      "AI-powered meal planning for 30 days",
      "Personalized diet recommendations",
      "Complete meal tracking & shopping list",
      "Exclusive nutritionist chat support",
      "Priority support & notifications",
    ],
    buttonText: "Subscribe Now",
    link: "https://buy.stripe.com/test_4gw0466Ky4Qiew89AC",
  },
];

export default function SubscriptionPlans() {
    const {user}=useAuthStore();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Choose Your Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className="p-6 bg-white shadow-xl rounded-2xl text-center flex flex-col justify-between"
          >
            <div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </CardTitle>
                <p className="text-lg text-gray-600 font-medium">
                  {plan.price}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4 text-gray-700">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="text-green-500 w-5 h-5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <div className="flex justify-center mt-4">
              <Link to={`${plan.link}?prefilled_email=${user?.email}`}>
                <Button className="text-white bg-blue-600 hover:bg-blue-700">
                  {plan.buttonText}
                </Button> 
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
