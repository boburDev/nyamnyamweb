"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { DOMAIN } from "@/constants";
import { CompletePayload } from "@/types";

export function useUpdateDetail(authId: string, locale: string) {
  return useMutation({
    mutationFn: async (payload: CompletePayload) => {
      const res = await axios.patch(
        `${DOMAIN}/auth/${authId}/update_detail/`,
        payload,
        {
          headers: {
            "Accept-Language": locale,
          },
        }
      );
      return res.data;
    },
  });
}
