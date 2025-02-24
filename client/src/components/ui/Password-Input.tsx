import { useState } from "react";
import { Input } from "./input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils"; 
import { useId } from "react"; 

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  className = "",
  value = "",
  onChange,
  placeholder = "Enter your password",
  name = "",
  error,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const uniqueId = useId(); 
  const inputId =  uniqueId;

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          className={cn("pe-9", className, error && "border-red-500")}
          type={isVisible ? "text" : "password"}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls={inputId}
        >
          {isVisible ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
