import { useState, FormEvent } from "react";
import { OTPInput } from "input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function EmailVerify() {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const { setAuth } = useAuthStore.getState();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(verificationCode);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/v1/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await res.json();
      console.log(data);
      setAuth(data.user);
      toast({
        title: "Success",
        description: "Login successfully",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Failure",
        description:  error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <h2 className="text-2xl mb-2 font-semibold leading-none tracking-tight capitalize">
              Verify your email
            </h2>
            <CardDescription>
              Enter the 6-digit code sent to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <InputDemo
                value={verificationCode}
                onChange={setVerificationCode}
              />
              <Button className="mt-3 col-span-2" type="submit">
                Verify email
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

type InputDemoProps = {
  value: string;
  onChange: (value: string) => void;
};

function InputDemo({ value, onChange }: InputDemoProps) {
  return (
    <div className="flex justify-center">
      <OTPInput
        id="input-44"
        containerClassName="has-[:disabled]:opacity-50"
        maxLength={6}
        value={value}
        onChange={onChange}
        render={({ slots }: any) => (
          <div className="flex">
            {slots.map((slot: any, idx: number) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
    </div>
  );
}

type SlotProps = {
  char: string | null;
  isActive: boolean;
};

function Slot({ char, isActive }: SlotProps) {
  return (
    <div
      className={cn(
        "relative -ms-px flex size-12 items-center justify-center border border-input bg-background font-medium text-foreground shadow-sm shadow-black/5 transition-shadow first:ms-0 first:rounded-s-lg last:rounded-e-lg",
        { "z-10 border border-ring ring-[3px] ring-ring/20": isActive }
      )}
    >
      {char !== null && <div>{char}</div>}
    </div>
  );
}
