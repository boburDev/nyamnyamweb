"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type PasswordInputProps = React.ComponentProps<typeof Input> & {
  buttonClassName?: string;
  className?: string;
};

export function PasswordInput({
  buttonClassName,
  className,
  ...inputProps
}: PasswordInputProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <Input
        {...inputProps}
        type={show ? "text" : "password"}
        className={cn("h-12 py-[7.5px] pl-4 pr-12", className)}
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((s) => !s)}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-900 transition-colors",
          buttonClassName
        )}
      >
        {show ? (
          <EyeOff size={20} className="text-iconColor" />
        ) : (
          <Eye size={20} className="text-iconColor" />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
