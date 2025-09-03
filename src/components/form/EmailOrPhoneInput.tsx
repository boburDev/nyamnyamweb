"use client";

import { Input } from "@/components/ui/input";
import React from "react";

type EmailOrPhoneInputProps = React.ComponentProps<typeof Input> & {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const EmailOrPhoneInput = React.forwardRef<
  HTMLInputElement,
  EmailOrPhoneInputProps
>(({ onChange, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    const fc = v.charAt(0);
    const intentPhone = fc === "+" || /^[0-9]$/.test(fc);
    if (intentPhone) {
      v = v.replace(/[^\d+]/g, "");
      if (v.startsWith("+")) {
        if (v.length > 13) v = v.slice(0, 13);
      } else {
        if (v.length > 9) v = v.slice(0, 9);
      }
    }
    onChange?.({
      ...e,
      target: { ...e.target, value: v },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const firstChar = (props.value as string)?.charAt(0);
  const isPhoneIntent = firstChar === "+" || /^[0-9]$/.test(firstChar ?? "");
  const inputMode = isPhoneIntent ? "tel" : "email";

  return (
    <Input ref={ref} {...props} onChange={handleChange} inputMode={inputMode} />
  );
});

EmailOrPhoneInput.displayName = "EmailOrPhoneInput";
