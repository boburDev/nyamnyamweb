import { useMutation } from "@tanstack/react-query";
import { LoginForm } from "@/types";
import { AxiosError } from "axios";

interface LoginSuccess {
  success: boolean;
}

interface LoginError {
  error: string;
}

export const useLogin = (locale: string) => {
  return useMutation<LoginSuccess, AxiosError<LoginError>, LoginForm>({
    mutationFn: async (data: LoginForm) => {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Login failed");
      }

      return json;
    },
  });
};
