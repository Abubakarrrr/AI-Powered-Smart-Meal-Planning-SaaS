import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PasswordInput from "@/components/ui/Password-Input";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
const BASE_URL = import.meta.env.VITE_API_URL;

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmNewPassword: z.string().min(8, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const ResetPassword: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordReset = async (data: PasswordFormData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/v1/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.newPassword,
          confirmPassword: data.confirmNewPassword,
        }),
      });
      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description: "Redirecting to login page...",
        });
        const data = await response.json();
        console.log(data);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Try again!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Reset Password
            </h2>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(handlePasswordReset)}
              className="space-y-4"
            >
              {/* New Password */}
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    placeholder="New Password"
                    error={errors.newPassword?.message}
                  />
                )}
              />

              {/* Confirm New Password */}
              <Controller
                name="confirmNewPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    placeholder="Confirm New Password"
                    error={errors.confirmNewPassword?.message}
                  />
                )}
              />

              {/* Submit Button */}
              <Button className="w-full capitalize" type="submit">
                Set new password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
