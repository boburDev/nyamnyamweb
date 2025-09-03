import { showSuccess } from "@/components/toast/Toast";
import { FORGOT_PASSWORD, SIGNUP } from "@/constants";
import axios from "axios";
import { useEffect, useState } from "react";

export const useVerify = (to: string, reset?: boolean) => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(!reset ? 60 : 0);
  const isEmail = to?.includes("@");

  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
  const seconds = String(timer % 60).padStart(2, "0");

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);
  const maskPhone = (phone: string) => {
    const match = phone?.match(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (!match) return phone;

    const [, code, _mid, _p1, p2] = match;
    return `+998 ${code} *** ** ${p2}`;
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return `${name[0] + name[1]}***@${domain}`;
  };

  const maskedTo = isEmail ? maskEmail(to) : maskPhone(to);
  const handleResend = async () => {
    if (timer > 0) return;
    const payload = isEmail ? { email: to } : { phone_number: to };
    try {
      await axios.post(reset ? FORGOT_PASSWORD : SIGNUP, payload);
      showSuccess("Kod qayta yuborildi");
      setTimer(60);
      console.log("Resend code");
    } catch (e) {
      console.error(e);
    }
  };
  const onlyDigits = (e: React.KeyboardEvent | React.ClipboardEvent) => {
    if ("clipboardData" in e) {
      const pasted = e.clipboardData.getData("text");
      if (!/^\d*$/.test(pasted)) e.preventDefault();
    } else {
      const key = (e as React.KeyboardEvent).key;
      if (
        !/[0-9]/.test(key) &&
        key !== "Backspace" &&
        !key.startsWith("Arrow")
      ) {
        e.preventDefault();
      }
    }
  };
  return {
    code,
    setCode,
    timer,
    minutes,
    seconds,
    isEmail,
    handleResend,
    maskedTo,
    onlyDigits,
  };
};
