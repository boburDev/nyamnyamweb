"use client"

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

type FormValues = { email: string };

export function useChangeEmail(locale: string) {
  return useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await axios.patch(
        '/api/email-phone',
        { email: data.email },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": locale,
          },
        }
      );
      return res.data;
    }
  })
}