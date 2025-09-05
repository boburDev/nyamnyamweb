import React, { useState } from "react";
import { IMaskInput } from "react-imask";

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
        className={className}
        {...rest}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
