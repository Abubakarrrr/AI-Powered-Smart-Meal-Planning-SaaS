const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Tell us about your dietary preferences, restrictions, and nutritional goals to personalize your experience.",
      image: "/placeholder.svg?height=300&width=400&text=Create+Profile",
    },
    {
      number: "02",
      title: "Get AI Recommendations",
      description: "Our AI analyzes your preferences and generates personalized meal plans and recipe suggestions.",
      image: "/placeholder.svg?height=300&width=400&text=AI+Recommendations",
    },
    {
      number: "03",
      title: "Shop with Smart Lists",
      description: "Use our automatically generated grocery lists to shop efficiently for your planned meals.",
      image: "/placeholder.svg?height=300&width=400&text=Smart+Shopping",
    },
    {
      number: "04",
      title: "Cook and Track",
      description: "Follow easy recipes and track your nutrition intake with our intuitive dashboard.",
      image: "/placeholder.svg?height=300&width=400&text=Cook+and+Track",
    },
  ]
  
  const HowItWorksSection = () => {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              How It <span className="text-[rgb(251,113,22)]">Works</span>
            </h2>
            <p className="mx-auto max-w-[800px] text-gray-600 md:text-lg">
              Our simple four-step process makes meal planning and healthy eating effortless
            </p>
          </div>
  
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <div className="flex-1">
                  <div className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-lg">
                    <img src={step.image || "/placeholder.svg"} alt={step.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-[rgb(251,113,22)]">
                    {step.number}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default HowItWorksSection
  
  