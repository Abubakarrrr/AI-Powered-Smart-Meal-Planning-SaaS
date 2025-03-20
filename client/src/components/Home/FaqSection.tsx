import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the AI meal planning work?",
    answer:
      "Our AI analyzes your dietary preferences, restrictions, nutritional goals, and available ingredients to generate personalized meal plans and recipe recommendations. The system learns from your feedback to improve suggestions over time.",
  },
  {
    question: "Can I customize my meal plans for specific diets?",
    answer:
      "Our platform supports a wide range of dietary preferences and restrictions, including vegetarian, vegan, keto, paleo, gluten-free, dairy-free, and many more. You can also specify allergies and ingredients you want to avoid.",
  },
  {
    question: "How accurate is the nutrition tracking?",
    answer:
      "Our nutrition tracking is based on comprehensive food databases and provides detailed information on macronutrients (protein, carbs, fats) and micronutrients (vitamins, minerals). While no tracking system is perfect, we strive for high accuracy and regularly update our database.",
  },
  {
    question: "Can I use the platform for my entire family?",
    answer:
      "Yes! Our Family plan allows you to create up to 6 different profiles, each with their own preferences and dietary needs. You can generate individual or family meal plans that accommodate everyone's requirements.",
  },
  {
    question: "How do I chat with nutritionists?",
    answer:
      "Premium and Family plan subscribers can access our chat feature to connect with certified nutritionists. Simply navigate to the 'Expert Advice' section and start a new conversation. Premium users get 2 chats per month, while Family plan users have unlimited access.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. We don't charge any cancellation fees, and you can easily reactivate your subscription later if you wish.",
  },
]

const FaqSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked <span className="text-[rgb(251,113,22)]">Questions</span>
          </h2>
          <p className="mx-auto max-w-[800px] text-gray-600 md:text-lg">
            Find answers to common questions about our AI-powered meal planning platform
          </p>
        </div>

        <div className="mx-auto max-w-[800px]">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Still have questions?{" "}
            <a href="#" className="font-medium text-[rgb(251,113,22)] hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default FaqSection

