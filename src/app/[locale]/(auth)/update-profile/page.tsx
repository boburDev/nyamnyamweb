"use client";

import axios, { AxiosError } from "axios";
import { useLocale } from "next-intl";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { showError, showSuccess } from "@/components/toast/Toast";
import { SubmitLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ArrowBackIcon } from "@/assets/icons";
import { useVerify } from "@/hooks/useVerify";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface VerifyOtpPayload {
  email?: string;
  phone_number?: string;
  code: string;
}

export default function UpdateProfilePage() {
  const to = useAuthStore((s) => s.to);
  const clearTo = useAuthStore((s) => s.clearTo);
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const {
    isEmail,
    setCode,
    code,
    updateResend,
    timer,
    minutes,
    seconds,
    maskedTo,
    onlyDigits,
  } = useVerify(to as string);

  const handleBack = () => {
    router.back();
  };
  // verify OTP mutation
  const mutation = useMutation({
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
    },
    onSuccess: () => {
      router.push("/profile");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      clearTo();
      showSuccess(isEmail ? "Email muvaffaqiyatli yangilandi" : "Telefon raqam muvaffaqiyatli yangilandi")
    },
    onError: (error: Error | AxiosError) => {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { error?: string })?.error ||
          error.message
          : error.message;
      showError(message);
    },
  });
  if (!to) return null;

  const handleVerify = () => {
    const payload = isEmail ? { email: to, code } : { phone_number: to, code };
    mutation.mutate(payload);
  };

  return (
    <div className="w-[390px] mx-auto">
      {/* top */}
      <div>
        <button onClick={handleBack} className="mb-[10px]">
          <ArrowBackIcon />
        </button>
        <h2 className="auth-title">Tasdiqlash kodi</h2>
        <p className="text-dolphin text-sm mb-[5px] max-w-[369px]">
          Biz {maskedTo} {isEmail ? "pochta manziliga" : "raqamiga SMS orqali"} 6 xonali kod yubordik.
        </p>
        <p className="text-dolphin text-sm">
          Iltimos, tasdiqlash uchun kodni kiriting.
        </p>
      </div>

      {/* otp */}
      <div className="mt-[30px]">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(val) => setCode(val)}
          inputMode="numeric"
          pattern="[0-9]*"
          onKeyDown={onlyDigits}
          onPaste={onlyDigits}
        >
          <InputOTPGroup className="gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    !e.key.startsWith("Arrow")
                  ) {
                    e.preventDefault();
                  }
                }}
                className="w-[55px] h-[55px] bg-dustColor/[3%] focus-visible:ring-1 !rounded-[10px] text-textColor text-[30px] border"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex justify-between items-center mt-[25px]">
        <button
          onClick={updateResend}
          disabled={timer > 0}
          className={`text-mainColor font-medium ${timer > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Qayta yuborish
        </button>
        <span className="text-textColor text-base font-medium">
          {minutes}:{seconds}
        </span>
      </div>

      {/* buttons */}
      <div className="flex mt-20 gap-[10px]">
        <Button
          variant={"outline"}
          className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
          onClick={handleBack}
        >
          Bekor qilish
        </Button>
        <Button
          onClick={handleVerify}
          disabled={code.length < 6 || mutation.isPending}
          className="flex-1 h-12 rounded-[12px]"
        >
          {mutation.isPending ? <SubmitLoader /> : "Tasdiqlash"}
        </Button>
      </div>
    </div>
  );
}
