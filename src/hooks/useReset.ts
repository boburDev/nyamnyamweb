import { FORGOT_PASSWORD, RESET_PASSWORD } from "@/constants";
import {
  ErrorResponseData,
  ForgotForm,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ResetPayload,
} from "@/types";
import { normalizePhone } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

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

export const useResetPassword = (locale: string) => {
  return useMutation<
    ResetPasswordResponse,
    AxiosError<ErrorResponseData>,
    ResetPayload & { confirm_token: string }
  >({
    mutationFn: async (payload: ResetPayload & { confirm_token: string }) => {
      const res = await axios.post(RESET_PASSWORD, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });
      return res.data.data;
    },
  });
};
