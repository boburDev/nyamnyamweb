"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { OTP, OTP_RESET_PASSWORD } from "@/constants";
import { VerifyResetPayload } from "@/types";

export function useVerifyResetOtp(locale: string) {
  return useMutation({
    mutationFn: async (payload: VerifyResetPayload) => {
      const res = await axios.post(OTP_RESET_PASSWORD, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });
      return res.data;
    },
  });
}
export function useVerifyOtp(locale: string) {
  return useMutation({
    mutationFn: async (payload: VerifyResetPayload) => {
      const res = await axios.post(OTP, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });
      return res.data;
    },
  });
}
