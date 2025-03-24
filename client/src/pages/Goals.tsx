import { CardFooter } from "@/components/ui/card"
import type React from "react"
import type { FieldPath } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm as useFormHook } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Check, ChevronRight, Dumbbell, Salad, Scale, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigate, useNavigate } from "react-router"
const BASE_URL = import.meta.env.VITE_API_URL;

// Define the form schema with Zod
const formSchema = z.object({
  goal: z.enum(["lose_fat", "maintain_weight", "build_muscle"], {
    required_error: "Please select a goal",
  }),
  sex: z.enum(["male", "female"], {
    required_error: "Please select your sex",
  }),
  heightFeet: z.coerce
    .number({
      required_error: "Please enter your height in feet",
      invalid_type_error: "Height must be a number",
    })
    .min(3, {
      message: "Height must be at least 3 feet",
    })
    .max(8, {
      message: "Height must be less than 8 feet",
    }),
  heightInches: z.coerce
    .number({
      required_error: "Please enter your height in inches",
      invalid_type_error: "Height must be a number",
    })
    .min(0, {
      message: "Inches must be between 0 and 11",
    })
    .max(11, {
      message: "Inches must be between 0 and 11",
    }),
  weight: z.coerce
    .number({
      required_error: "Please enter your weight",
      invalid_type_error: "Weight must be a number",
    })
    .min(30, {
      message: "Weight must be at least 30kg",
    })
    .max(300, {
      message: "Weight must be less than 300kg",
    }),
  age: z.coerce
    .number({
      required_error: "Please enter your age",
      invalid_type_error: "Age must be a number",
    })
    .min(16, {
      message: "You must be at least 16 years old",
    })
    .max(120, {
      message: "Age must be less than 120",
    }),
  bodyFat: z.enum(["low", "medium", "high"], {
    required_error: "Please select your body fat level",
  }),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"], {
    required_error: "Please select your activity level",
  }),
  foodExclusions: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function UserProfileForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [exclusions, setExclusions] = useState<string[]>([])
  const [exclusionInput, setExclusionInput] = useState("")
  const totalSteps = 8
  const progress = (step / totalSteps) * 100

  // Initialize the form
  const form = useFormHook<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: undefined,
      sex: undefined,
      heightFeet: undefined,
      heightInches: undefined,
      weight: undefined,
      age: undefined,
      bodyFat: undefined,
      activityLevel: undefined,
      foodExclusions: "",
    },
  })

  const {
    formState: { errors },
    trigger,
  } = form

  // Handle form submission
  async function onSubmit(data: FormValues) {
    // Combine the form data with the exclusions
    const profileInfo = {
      ...data,
      foodExclusions: exclusions.join(", "),
    }
    try {
      const res = await fetch(`${BASE_URL}/api/user/v1/create-user-profile`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({profileInfo}),
      });
      const data = await res.json();
      console.log(data)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
    
  }

  // Handle adding food exclusions
  function addExclusion() {
    if (exclusionInput.trim() && !exclusions.includes(exclusionInput.trim())) {
      setExclusions([...exclusions, exclusionInput.trim()])
      setExclusionInput("")
    }
  }

  // Handle removing food exclusions
  function removeExclusion(item: string) {
    setExclusions(exclusions.filter((i) => i !== item))
  }

  // Handle key press for adding exclusions
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      addExclusion()
    }
  }

  // Next step handler
  async function nextStep() {
    const fieldsToValidate = getFieldsForStep(step)
    const stepIsValid = await trigger(fieldsToValidate)

    if (stepIsValid) {
      if (step < totalSteps) {
        setStep(step + 1)
      }
    }
  }

  // Previous step handler
  function prevStep() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Helper function to get fields for each step
  function getFieldsForStep(step: number): FieldPath<FormValues>[] {
    switch (step) {
      case 1:
        return ["goal"]
      case 2:
        return ["sex"]
      case 3:
        return ["heightFeet", "heightInches"]
      case 4:
        return ["weight"]
      case 5:
        return ["age"]
      case 6:
        return ["bodyFat"]
      case 7:
        return ["activityLevel"]
      case 8:
        return ["foodExclusions"]
      default:
        return []
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-950">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Tell us about yourself</CardTitle>
          <CardDescription className="text-muted-foreground">
            Tell us about yourself so we can create your personalized meal plan
          </CardDescription>
          <Progress value={progress} className="h-2 w-full" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex min-h-[300px] flex-col items-center justify-center">
                {/* Step 1: Goal */}
                {step === 1 && (
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem className="space-y-4 text-center w-full">
                        <FormLabel className="text-lg font-semibold">What is your primary goal?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4 md:grid-cols-3"
                          >
                            <FormItem className="flex flex-col items-center space-y-3">
                              <FormControl>
                                <RadioGroupItem value="lose_fat" className="peer sr-only" id="goal-lose-fat" />
                              </FormControl>
                              <FormLabel
                                htmlFor="goal-lose-fat"
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <Scale className="mb-3 h-8 w-8 text-primary" />
                                <div className="text-center font-medium">Lose Fat</div>
                                <div className="text-center text-xs text-muted-foreground">
                                  Reduce body fat while preserving muscle
                                </div>
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex flex-col items-center space-y-3">
                              <FormControl>
                                <RadioGroupItem value="maintain_weight" className="peer sr-only" id="goal-maintain" />
                              </FormControl>
                              <FormLabel
                                htmlFor="goal-maintain"
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <Salad className="mb-3 h-8 w-8 text-primary" />
                                <div className="text-center font-medium">Maintain Weight</div>
                                <div className="text-center text-xs text-muted-foreground">
                                  Keep your current weight and improve health
                                </div>
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex flex-col items-center space-y-3">
                              <FormControl>
                                <RadioGroupItem value="build_muscle" className="peer sr-only" id="goal-build-muscle" />
                              </FormControl>
                              <FormLabel
                                htmlFor="goal-build-muscle"
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <Dumbbell className="mb-3 h-8 w-8 text-primary" />
                                <div className="text-center font-medium">Build Muscle</div>
                                <div className="text-center text-xs text-muted-foreground">
                                  Increase muscle mass and strength
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 2: Sex */}
                {step === 2 && (
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem className="space-y-4 text-center w-full">
                        <FormLabel className="text-lg font-semibold">What is your sex?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[200px] mx-auto">
                              <SelectValue placeholder="Select your sex" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 3: Height */}
                {step === 3 && (
                  <div className="space-y-4 text-center w-full">
                    <FormLabel className="text-lg font-semibold">What is your height?</FormLabel>
                    <div className="flex justify-center space-x-4">
                      <FormField
                        control={form.control}
                        name="heightFeet"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" placeholder="Feet" {...field} className="text-center w-20" />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="heightInches"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" placeholder="Inches" {...field} className="text-center w-20" />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormDescription>Enter your height in feet and inches</FormDescription>
                  </div>
                )}

                {/* Step 4: Weight */}
                {step === 4 && (
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="space-y-4 text-center w-full">
                        <FormLabel className="text-lg font-semibold">What is your weight?</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your weight in kg"
                            {...field}
                            className="text-center w-[200px] mx-auto"
                          />
                        </FormControl>
                        <FormDescription>Your weight in kilograms</FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 5: Age */}
                {step === 5 && (
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="space-y-4 text-center w-full">
                        <FormLabel className="text-lg font-semibold">What is your age?</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your age"
                            {...field}
                            className="text-center w-[200px] mx-auto"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 6: Body Fat */}
                {step === 6 && (
                  <FormField
                    control={form.control}
                    name="bodyFat"
                    render={({ field }) => (
                      <FormItem className="space-y-4 text-center w-full">
                        <FormLabel className="text-lg font-semibold">What is your body fat level?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4 md:grid-cols-3"
                          >
                            <FormItem className="flex flex-col items-center space-y-3">
                              <FormControl>
                                <RadioGroupItem value="low" className="peer sr-only" id="body-fat-low" />
                              </FormControl>
                              <FormLabel
                                htmlFor="body-fat-low"
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className="text-center font-medium">Low</div>
                                <div className="text-center text-xs text-muted-foreground">
                                  Visible muscle definition
                                </div>
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex flex-col items-center space-y-3">
                              <FormControl>
                                <RadioGroupItem value="medium" className="peer sr-only" id="body-fat-medium" />
                              </FormControl>
                              <FormLabel
                                htmlFor="body-fat-medium"
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className="text-center font-medium">Medium</div>
                                <div className="text-center text-xs text-muted-foreground">
                                  Some definition with some fat
                                </div>
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex flex-col items-center space-y-3">
                              <FormControl>
                                <RadioGroupItem value="high" className="peer sr-only" id="body-fat-high" />
                              </FormControl>
                              <FormLabel
                                htmlFor="body-fat-high"
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className="text-center font-medium">High</div>
                                <div className="text-center text-xs text-muted-foreground">
                                  Limited muscle definition
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 7: Activity Level */}
                {step === 7 && (
                  <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem className="space-y-4 text-center w-full">
                        <FormLabel className="text-lg font-semibold">What is your activity level?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[300px] mx-auto">
                              <SelectValue placeholder="Select your activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (Office job, little exercise)</SelectItem>
                            <SelectItem value="light">Light (Light exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="moderate">Moderate (Exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="active">Active (Exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="very_active">Very Active (Athlete, physical job)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How active are you on a daily basis?</FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 8: Food Exclusions */}
                {step === 8 && (
                  <div className="space-y-4 text-center w-full">
                    <FormLabel className="text-lg font-semibold">Any food exclusions?</FormLabel>
                    <FormDescription className="mb-3">Add any foods you don't eat or are allergic to</FormDescription>

                    <div className="flex justify-center gap-2">
                      <Input
                        value={exclusionInput}
                        onChange={(e) => setExclusionInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="E.g. peanuts, shellfish"
                        className="w-[200px]"
                      />
                      <Button type="button" onClick={addExclusion} size="sm">
                        Add
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {exclusions.map((item) => (
                        <Badge key={item} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                          {item}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => removeExclusion(item)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {item}</span>
                          </Button>
                        </Badge>
                      ))}
                      {exclusions.length === 0 && (
                        <div className="text-sm text-muted-foreground">No exclusions added yet</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
            Back
          </Button>

          {step < totalSteps ? (
            <Button type="button" onClick={nextStep}>
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Save Profile <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

