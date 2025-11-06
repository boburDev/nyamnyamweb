"use client";
import { showError, showSuccess } from "@/components/toast/Toast";
import { FORGOT_PASSWORD, SIGNUP } from "@/constants";
import axios, { AxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { normalizePhone } from "@/utils/sign";

export const useVerify = (to: string, reset?: boolean) => {
  const t = useTranslations("toast");
  const [code, setCode] = useState("");
  // Timer should always start at 60 seconds for all cases
  const [timer, setTimer] = useState(60);
  const isEmail = to?.includes("@");
  const locale = useLocale();
  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
  const seconds = String(timer % 60).padStart(2, "0");

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);
  const maskPhone = (phone: string) => {
    // Remove spaces before matching
    const cleanPhone = phone?.trim().replace(/\s/g, "") || "";
    const match = cleanPhone.match(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/);
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
    // Normalize phone number by removing spaces and ensuring correct format
    const cleanTo = isEmail ? to : to.trim().replace(/\s/g, "");
    const normalizedTo = isEmail ? cleanTo : normalizePhone(cleanTo);
    const payload = isEmail ? { email: normalizedTo } : { phone: normalizedTo };
    try {
      await axios.post(reset ? FORGOT_PASSWORD : SIGNUP, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });
      setCode("");
      showSuccess(t("code-resent"));
      setTimer(60);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.error_message;
        showError(message);
      }
    }
  };
  const updateResend = async () => {
    if (timer > 0) return;
    // Normalize phone number by removing spaces and ensuring correct format
    const cleanTo = isEmail ? to : to.trim().replace(/\s/g, "");
    const normalizedTo = isEmail ? cleanTo : normalizePhone(cleanTo);
    const payload = isEmail ? { email: normalizedTo } : { phone: normalizedTo };
    try {
      await axios.patch(`/api/email-phone`, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });
      setCode("");
      showSuccess(t("code-resent"));
      setTimer(60);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.error_message;
        showError(message);
      }
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
    updateResend,
  };
};
