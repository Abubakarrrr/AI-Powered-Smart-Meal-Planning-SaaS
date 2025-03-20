import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "AI-Powered Recipe Recommendations",
    description:
      "Get personalized recipe suggestions based on your dietary preferences, available ingredients, and nutritional goals.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[rgb(251,113,22)]"
      >
        <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
      </svg>
    ),
  },
  {
    title: "Smart Grocery Lists",
    description:
      "Automatically generate shopping lists based on your meal plans, with intelligent grouping by store sections.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[rgb(251,113,22)]"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
        <path d="M3 6h18"></path>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
    ),
  },
  {
    title: "Nutrition Tracking",
    description:
      "Monitor your calorie intake, macronutrients, and micronutrients with detailed analytics and insights.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[rgb(251,113,22)]"
      >
        <path d="M2 12h20"></path>
        <path d="M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"></path>
        <path d="M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4"></path>
        <path d="M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1"></path>
        <path d="M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1"></path>
      </svg>
    ),
  },
  {
    title: "Expert Nutritionist Chat",
    description: "Connect with certified nutritionists in real-time for personalized advice and meal plan adjustments.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[rgb(251,113,22)]"
      >
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
      </svg>
    ),
  },
  {
    title: "Dietary Restriction Management",
    description:
      "Easily manage allergies, intolerances, and dietary preferences with our comprehensive filtering system.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[rgb(251,113,22)]"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="m4.93 4.93 14.14 14.14"></path>
      </svg>
    ),
  },
  {
    title: "Meal Prep Guides",
    description: "Step-by-step instructions for efficient meal preparation, saving you time and reducing food waste.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[rgb(251,113,22)]"
      >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
        <path d="M7 2v20"></path>
        <path d="M21 15V2"></path>
        <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>
        <path d="M18 21a6 6 0 0 0-6-6h-3"></path>
      </svg>
    ),
  },
]

const FeaturesSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powerful Features for Your <span className="text-[rgb(251,113,22)]">Meal Planning</span> Journey
          </h2>
          <p className="mx-auto max-w-[800px] text-gray-600 md:text-lg">
            Our platform combines cutting-edge AI technology with nutritional expertise to make healthy eating simple,
            delicious, and personalized.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

