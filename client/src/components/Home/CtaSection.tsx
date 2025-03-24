import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const CtaSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[rgb(251,113,22)] px-6 py-16 sm:px-12 sm:py-20">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-400 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-500 opacity-20 blur-3xl"></div>

          <div className="relative z-10 mx-auto max-w-[800px] text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to Transform Your Meal Planning Experience?
            </h2>
            <p className="mb-8 text-lg text-orange-100">
              Join thousands of users who have simplified their meal planning, improved their nutrition, and reduced
              food waste with our AI-powered platform.
            </p>

            <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 border-white bg-white/10 text-white placeholder:text-orange-100"
              />
              <Link to="/subscription">
              <Button className="h-12 bg-white text-[rgb(251,113,22)] hover:bg-orange-50" size="lg">
                Start  Trial
              </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm text-orange-100">Credit card required.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection

