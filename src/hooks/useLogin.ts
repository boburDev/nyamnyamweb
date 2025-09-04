import { SIGNIN } from "@/constants";
import { LoginForm } from "@/types";
import { normalizePhone } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface LoginResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export const useLogin = (locale: string) => {
  return useMutation<LoginResponse, AxiosError, LoginForm>({
    mutationFn: async (data: LoginForm) => {
      const isEmail = data.emailOrPhone.includes("@");
      const emailOrPhone = isEmail
        ? { email: data.emailOrPhone.trim() }
        : { phone_number: normalizePhone(data.emailOrPhone) };

      const payload = {
        ...emailOrPhone,
        password: data.password,
      };

      const res = await axios.post(SIGNIN, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });

      return res.data.data;
    },
  });
};
