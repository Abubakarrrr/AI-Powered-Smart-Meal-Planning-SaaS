import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
const BASE_URL = import.meta.env.VITE_API_URL;


const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "nutritionist"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState<"user" | "nutritionist">("user");

  const { loading, triggerFetch } = useFetch();
  const { setAuth } = useAuthStore.getState();

  const handleFormSubmit = async (data: SignupFormData) => {
    try {
      const apiData = await triggerFetch(
        "http://localhost:3000/api/auth/v1/signup",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      setAuth(apiData.data.user);
      navigate("/email-verify");
      toast({
        title: "Success",
        description: "Verification email send to your email",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async (response: any) => {
    if ("credential" in response && response.credential) {
      try {
        const apiData = await fetch(`${BASE_URL}/api/auth/v1/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.credential,
          }),
        });
        const data = await apiData.json();

        console.log("User data:", data.data.user);
        toast({
          variant: "default",
          title: "Success",
          description: "Login successful",
        });
        setAuth(data.data.user);
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
        toast({
          variant: "default",
          title: "Error",
          description: "Google login failed",
        });
      }
    } else {
      console.log("not running");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register("role")}
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "user" | "nutritionist")
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="user">User</option>
                <option value="nutritionist">Nutritionist</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-2 text-sm text-gray-600">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Login Button */}
            {/* Google Login Button */}
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.error("Google login failed");
                  toast({
                    variant: "default",
                    title: "Error",
                    description: "Google login failed",
                  });
                }}
              />
            </GoogleOAuthProvider>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
