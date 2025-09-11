"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CompletePayload } from "@/types";

export function useUpdateDetail(locale: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompletePayload & { authId: string }) => {
      const res = await axios.patch("/api/auth/signup-complete", payload, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
