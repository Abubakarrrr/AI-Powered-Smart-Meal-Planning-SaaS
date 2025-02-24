import { Link, useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import EmailInput from "@/components/ui/Email-Input";
import { useToast } from "@/hooks/use-toast";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/auth/v1/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();
      console.log(data);
      toast({
        title: "Email sent!",
        description: "Check your email to reset your password",
      });
      // navigate("/reset-password");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {/* Card */}
          <Card>
            <CardHeader className="text-center">
              <h2 className="text-2xl mb-2 font-semibold leading-none tracking-tight capitalize">
                Forgot Password
              </h2>
              <CardDescription>
                Enter your email address and we&apos;ll send you a link to reset
                your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <EmailInput
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                />
                <Button className="mt-3 capitalize" type="submit">
                  Send reset link
                </Button>
                <Link to="/login">
                  <div className="flex items-center justify-center">
                    <MoveLeft className="w-4" />
                    <p className="text-center ml-2">Back to Login</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
}
