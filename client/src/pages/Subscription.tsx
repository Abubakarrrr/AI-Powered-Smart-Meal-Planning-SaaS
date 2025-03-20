import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import ButtonCustomerPortal from "@/components/payments/ButtonCustomerPortal";
import { useEffect, useState } from "react";
const customerPortalLink =
  "https://billing.stripe.com/p/login/test_00gdUxbbUajx78A8ww";
const BASE_URL = import.meta.env.VITE_API_URL;

const plans = [
  {
    name: "Starter",
    price: "$5/day",
    description:
      "Perfect for individuals just starting their meal planning journey",
    features: [
      "AI-powered meal planning for 1 day",
      "Basic nutritional insights",
      "Limited meal tracking",
    ],
    popular: false,
    buttonText: "Subscribe now",
    priceId: "price_1R28kmFeQxKeW8MZP5VgzaZW",
  },
  {
    name: "Pro",
    price: "$19.99",
    description: "Ideal for health-conscious individuals and families",
    features: [
      "AI-powered meal planning for 7 days",
      "Advanced nutritional insights",
      "Full meal tracking & shopping list",
      "Access to community forum",
    ],
    popular: true,
    buttonText: "Subscribe now",
    priceId: "price_1R28lEFeQxKeW8MZCQpl6QDL",
  },
  {
    name: "Premium",
    price: "$29.99",
    description:
      "Comprehensive solution for families with diverse dietary needs",
    features: [
      "AI-powered meal planning for 30 days",
      "Personalized diet recommendations",
      "Complete meal tracking & shopping list",
      "Exclusive nutritionist chat support",
      "Priority support & notifications",
    ],
    popular: false,
    buttonText: "Subscrie now",
    priceId: "price_1R28ldFeQxKeW8MZ4BMH93mE",
  },
];

const PricingSection = () => {
  const { user } = useAuthStore();
  const [status, setStatus] = useState();

  const getSubscriptionStatus = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/payment/v1/get-subscription-status`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setStatus(data.subscriptionStatus);
      //   console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSubscriptionStatus();
  });

  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/payment/v1/create-checkout-session`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: priceId,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.url) window.location.href = data.url; // Redirect to Stripe
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, Transparent{" "}
            <span className="text-[rgb(251,113,22)]">Pricing</span>
          </h2>

          <div className="my-4">
            {status === "active" && (
              <a
                href={customerPortalLink + "?prefilled_email=" + user?.email}
                className="btn"
              >
                Go to Billing dashboard
              </a>
            )}
          </div>

          <p className="mx-auto max-w-[800px] text-gray-600 md:text-lg">
            Choose the plan that fits your needs. All plans include a 14-day
            free trial.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden ${
                plan.popular
                  ? "border-[rgb(251,113,22)] shadow-lg"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0">
                  <div className="bg-[rgb(251,113,22)] px-4 py-1 text-xs font-medium text-white">
                    MOST POPULAR
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500"> / month</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-[rgb(251,113,22)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              {!(status === "active") && (
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-[rgb(251,113,22)] hover:bg-[rgb(231,93,2)] text-white"
                        : "bg-white border border-[rgb(251,113,22)] text-[rgb(251,113,22)] hover:bg-orange-50"
                    }`}
                    size="lg"
                    onClick={() => handleSubscribe(plan.priceId)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600">
            All plans include a free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
