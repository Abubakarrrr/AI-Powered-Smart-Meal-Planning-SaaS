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

export default function EmailVerify() {
  const [verificationCode, setVerificationCode] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(verificationCode);
    try {
      // Verification logic here
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-2 sm:px-8 lg:px-16">
      <div className="py-8">
        <div className="mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="max-w-lg mx-auto">
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
                    <InputDemo value={verificationCode} onChange={setVerificationCode} />
                    <Button className="mt-3 col-span-2" type="submit">
                      Verify email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
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
        render={({ slots }:any) => (
          <div className="flex">
            {slots.map((slot:any, idx:number) => (
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
