import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface PhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value: string;
  onChange: (val: string) => void;
  onComplete?: () => void;
  onIncomplete?: () => void;
  id?: string;
  className?: string;
  defaultValue?: string | number;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      onComplete,
      onIncomplete,
      id,
      className,
      defaultValue,
      ...rest
    },
    ref
  ) => {
    const [_isComplete, setIsComplete] = useState(false);

    return (
      <IMaskInput
        mask={"+998 00 000 0000"}
        definitions={{ "0": /\d/ }}
        unmask={false}
        placeholderChar="_"
        lazy={false}
        defaultValue={defaultValue}
        value={value}
        onAccept={(val: string, mask) => {
          onChange(val);
          if (mask.masked.isComplete) {
            setIsComplete(true);
            onComplete?.();
          } else {
            setIsComplete(false);
            onIncomplete?.();
          }
        }}
        inputRef={ref}
        id={id}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...rest}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
