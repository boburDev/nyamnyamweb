import { SIGNUP } from "@/constants";
import { normalizePhone } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface RegisterForm {
  emailOrPhone: string;
}

interface RegisterResponse {
  otp_sent: boolean;
  id: string;
}

export const useRegister = (locale: string) => {
  return useMutation<RegisterResponse, AxiosError, RegisterForm>({
    mutationFn: async (data: RegisterForm) => {
      const isEmail = data.emailOrPhone.includes("@");
      const payload = isEmail
        ? { email: data.emailOrPhone }
        : { phone_number: normalizePhone(data.emailOrPhone) };

      const res = await axios.post(SIGNUP, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });

      return res.data.data;
    },
  });
};
