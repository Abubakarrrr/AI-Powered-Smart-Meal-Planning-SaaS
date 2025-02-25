import React from "react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
const BASE_URL = import.meta.env.VITE_API_URL;
// Zod validation schema for login form
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter a password"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { setAuth } = useAuthStore.getState();

  const { loading, error, triggerFetch } = useFetch();

  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      const apiData = await triggerFetch(
        "http://localhost:3000/api/auth/v1/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!apiData) {
        toast({
          title: "Failure",
          description: error,
        });
      } else {
        setAuth(apiData.user);
        navigate("/");
        toast({
          title: "Success",
          description: "Login successfully",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Failure",
        description: "Something went wrong",
      });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="space-y-4"
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
          </form>

          {/* OR Separator */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-sm text-gray-600">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

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

          {/* Sign up Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
