"use client"

import axios from "axios";
import { useMutation } from "@tanstack/react-query"

interface VerifyOtpPayload {
  email?: string;
  phone_number?: string;
  code: string;
}

export const useUpdateVerify = (locale: string) => {
  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const res = await axios.post(
        "/api/verify-update",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": locale,
          },
        }
      );
      return res.data;
    }
  });
}