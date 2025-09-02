import { FORGOT_PASSWORD } from "@/constants";
import { normalizePhone } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface ForgotForm {
  emailOrPhone: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export const useForgotPassword = (locale: string) => {
  return useMutation<ForgotPasswordResponse, AxiosError, ForgotForm>({
    mutationFn: async (data: ForgotForm) => {
      const isEmail = data.emailOrPhone.includes("@");
      const payload = isEmail
        ? { email: data.emailOrPhone }
        : { phone_number: normalizePhone(data.emailOrPhone) };

      const res = await axios.post(FORGOT_PASSWORD, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });

      return res.data;
    },
  });
};
