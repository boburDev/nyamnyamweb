"use client";

import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input/PhoneInput";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

type EmailOrPhoneInputProps = React.ComponentProps<typeof Input> & {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const EmailOrPhoneInput = React.forwardRef<
  HTMLInputElement,
  EmailOrPhoneInputProps
>(({ onChange, value, defaultValue, ...props }, ref) => {
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const wasFocusedRef = useRef(false);
  const prevModeRef = useRef(isPhoneMode);

  // Sync refs
  useEffect(() => {
    if (typeof ref === "function") {
      ref(internalRef.current);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = internalRef.current;
    }
  }, [ref, isPhoneMode]);

  // Determine if we should use phone mode based on current value
  useEffect(() => {
    const currentValue = (value as string) || "";

    // If value contains @, it's definitely email
    if (currentValue.includes("@")) {
      setIsPhoneMode(false);
      return;
    }

    // If value starts with + or digit, it's phone
    const firstChar = currentValue.charAt(0);
    if (firstChar === "+" || /^[0-9]$/.test(firstChar)) {
      setIsPhoneMode(true);
      return;
    }

    // If empty, default to email mode
    if (currentValue === "") {
      setIsPhoneMode(false);
    }
  }, [value]);

  // Restore focus after mode switch
  useLayoutEffect(() => {
    if (prevModeRef.current !== isPhoneMode && wasFocusedRef.current) {
      // Small delay to ensure the new input is mounted
      setTimeout(() => {
        if (internalRef.current) {
          internalRef.current.focus();
          // Restore cursor position if possible
          const length = (value as string)?.length || 0;
          if (internalRef.current.setSelectionRange) {
            internalRef.current.setSelectionRange(length, length);
          }
        }
      }, 0);
    }
    prevModeRef.current = isPhoneMode;
  }, [isPhoneMode, value]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    wasFocusedRef.current = document.activeElement === e.target;

    // If user types @, switch to email mode
    if (v.includes("@")) {
      setIsPhoneMode(false);
    }

    // If user starts with + or digit, switch to phone mode
    const firstChar = v.charAt(0);
    if ((firstChar === "+" || /^[0-9]$/.test(firstChar)) && !v.includes("@")) {
      setIsPhoneMode(true);
    }

    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    wasFocusedRef.current = true;
    props.onFocus?.(e);
  };

  const handlePhoneChange = (val: string) => {
    // Convert PhoneInput's onChange format to React.ChangeEvent format
    const syntheticEvent = {
      target: { value: val },
      currentTarget: { value: val },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
  };

  // If phone mode, use PhoneInput
  if (isPhoneMode) {
    return (
      <PhoneInput
        ref={internalRef}
        value={(value as string) || ""}
        onChange={handlePhoneChange}
        defaultValue={defaultValue as string | number | undefined}
        onFocus={handleFocus}
        {...props}
      />
    );
  }

  // Otherwise use regular Input for email
  return (
    <Input
      ref={internalRef}
      {...props}
      value={value}
      onChange={handleEmailChange}
      onFocus={handleFocus}
      inputMode="email"
      type="email"
    />
  );
});

EmailOrPhoneInput.displayName = "EmailOrPhoneInput";
