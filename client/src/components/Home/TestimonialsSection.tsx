import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import dummy from "@/assets/dummy.jpg"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Busy Professional",
    image: "/placeholder.svg?height=80&width=80&text=SJ",
    quote:
      "This app has completely transformed how I approach meal planning. The AI recommendations are spot-on, and I've saved so much time and reduced food waste!",
    stars: 5,
  },
  {
    name: "Michael Chen",
    role: "Fitness Enthusiast",
    image: "/placeholder.svg?height=80&width=80&text=MC",
    quote:
      "As someone who tracks macros carefully, this platform has been a game-changer. The nutrition tracking is detailed and the meal suggestions align perfectly with my fitness goals.",
    stars: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Mom of Three",
    image: "/placeholder.svg?height=80&width=80&text=ER",
    quote:
      "Managing meals for a family with different dietary needs was a nightmare until I found this app. Now everyone gets meals they enjoy that meet their nutritional needs!",
    stars: 5,
  },
  {
    name: "David Thompson",
    role: "Vegetarian Cook",
    image: "/placeholder.svg?height=80&width=80&text=DT",
    quote:
      "The variety of vegetarian recipes is impressive, and I love how the AI learns my preferences over time. The meal prep guides have also helped me become more efficient in the kitchen.",
    stars: 4,
  },
]

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What Our <span className="text-[rgb(251,113,22)]">Users</span> Say
          </h2>
          <p className="mx-auto max-w-[800px] text-gray-600 md:text-lg">
            Join thousands of satisfied users who have transformed their meal planning experience
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.stars
                          ? "fill-[rgb(251,113,22)] text-[rgb(251,113,22)]"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="mb-6 text-gray-700">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src="https://github.com/shadcn.png"
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection

