import React from "react";
import { useForm } from "react-hook-form";
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
import axios from "axios";
// const clientId = import.meta.env.OAUTH_CLIENT_ID;

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

  const {
    data: apiData,
    loading,
    error,
    triggerFetch,
  } = useFetch<any>("http://localhost:3000/api/auth/login");

  const handleLoginSubmit = async (data: LoginFormData) => {
    console.log(data);
    await triggerFetch({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: "Login successfull",
        });
        setAuth(apiData?.user);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "default",
          title: "Error",
          description: "Error while logging in",
        });
      });
  };

  const handleGoogleLogin = async (response: any) => {
    if ("credential" in response && response.credential) {
      try {
        // Send the token to your server to authenticate the user
        const data = await axios.post(
          "http://localhost:3000/api/auth/google",
          {
            token: response.credential,
          }
        );
        console.log("User data:", data);
        // Handle user session or redirection after successful login
        // setAuth(data?.user)
        toast({
          variant: "default",
          title: "Success",
          description: "Login successful",
        });
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
        toast({
          variant: "default",
          title: "Error",
          description: "Google login failed",
        });
      }
    }
    else{
      console.log("not running")
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
          </form>

          {/* OR Separator */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-sm text-gray-600">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <GoogleOAuthProvider clientId="959770107004-m7b9du2acvifvhlc8mjh74c856hh2apo.apps.googleusercontent.com">
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
