"use client";

import { AxiosError } from "axios";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { showError } from "@/components/toast/Toast";
import { SubmitLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ArrowBackIcon } from "@/assets/icons";
import { useVerify } from "@/hooks/useVerify";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import { useVerifyResetOtp } from "@/hooks";

export default function VerifyPage() {
  const to = useAuthStore((s) => s.to);
  const setConfirm = useAuthStore((s) => s.setConfirm);
  const router = useRouter();
  const locale = useLocale();
  const params = useSearchParams();
  const reset = params.get("reset");
  const isReset = reset === "true";
  const {
    isEmail,
    setCode,
    code,
    handleResend,
    timer,
    minutes,
    seconds,
    maskedTo,
    onlyDigits,
  } = useVerify(to as string, reset !== null ? isReset : undefined);
  const { mutate: verifyOtp, isPending } = useVerifyResetOtp(locale);

  const handleBack = () => {
    router.back();
  };
  if (!to) return null;
  const hanleVerify = () => {
    const payload = isEmail ? { email: to, code } : { phone_number: to, code };

    verifyOtp(payload, {
      onSuccess: (data) => {
        setConfirm(data.data.confirm_token);
        router.push("/reset-password");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const message = error.response?.data?.error_message;
          showError(message);
        }
      },
    });
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
          Biz {maskedTo} {isEmail ? "pochta manziliga" : "raqamiga SMS orqali"}{" "}
          6 xonali kod yubordik.
        </p>
        <p className="text-dolphin text-sm">
          Iltimos, tasdiqlash uchun kodni kiriting.
        </p>
      </div>
      {/* otp */}
      <div className="mt-[30px]">
        <InputOTP
          value={code}
          maxLength={6}
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
          onClick={handleResend}
          disabled={timer > 0}
          className={`text-mainColor font-medium ${
            timer > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Qayta yuborish
        </button>
        <span className="text-textColor text-base font-medium">
          {minutes}:{seconds}
        </span>
      </div>
      {/* button */}
      <div className="flex  mt-20 gap-[10px]">
        <Button
          variant={"outline"}
          className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
          onClick={handleBack}
        >
          Bekor qilish
        </Button>
        <Button
          onClick={hanleVerify}
          disabled={code.length < 6 || isPending}
          className="flex-1 h-12 rounded-[12px]"
        >
          {isPending ? <SubmitLoader /> : "Tasdiqlash"}
        </Button>
      </div>
    </div>
  );
}
