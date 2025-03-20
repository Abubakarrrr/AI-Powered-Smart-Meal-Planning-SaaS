import { Button } from "@/components/ui/button"
import dashboard from "@/assets/dashboard.png"
import { Link } from "react-router-dom"
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-32">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-50"></div>
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-200 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-orange-300 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                AI-Powered <span className="text-[rgb(251,113,22)]">Meal Planning</span> Made Simple
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Personalized recipes, smart grocery lists, and nutrition tracking - all powered by AI to make healthy
                eating effortless.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/login">
              <Button className="bg-[rgb(251,113,22)] hover:bg-[rgb(231,93,2)] text-white" size="lg">
                Start Free Trial
              </Button>
              </Link>
              <Link to="/meals">
              <Button
                variant="outline"
                size="lg"
                className="border-[rgb(251,113,22)] text-[rgb(251,113,22)] hover:bg-orange-50"
              >
                See How It Works
              </Button>
              </Link>
             
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                    <img
                      src={`https://github.com/shadcn.png`}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-medium text-[rgb(251,113,22)]">1,000+</span> happy users
              </p>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={dashboard}
                alt="AI Meal Planning Dashboard"
                className="h-full w-full object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-lg bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Personalized for you</p>
                  <p className="text-xs text-gray-500">Based on your preferences</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-6 top-1/4 rounded-lg bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[rgb(251,113,22)]"
                  >
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                    <path d="M12 7c1.5 0 2.5.5 2.5 2v8.5"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Nutritionally balanced</p>
                  <p className="text-xs text-gray-500">Optimized for your health</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

