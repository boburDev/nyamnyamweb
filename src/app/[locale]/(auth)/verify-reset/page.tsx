"use client";

import { AxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";

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
  const t = useTranslations("confirm-password");
  const to = useAuthStore((s) => s.to);
  const setConfirm = useAuthStore((s) => s.setConfirm);
  const router = useRouter();
  const locale = useLocale();
  // Always use reset=true for verify-reset page since it's specifically for password reset
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
  } = useVerify(to as string, true);
  const { mutate: verifyOtp, isPending } = useVerifyResetOtp(locale);

  const handleBack = () => {
    router.back();
  };
  if (!to) return null;
  const hanleVerify = () => {
    const payload = isEmail ? { email: to, code } : { phone: to, code };

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
    <div className="flex flex-col w-full h-full sm:h-auto">
      {/* top */}
      <div>
        <button onClick={handleBack} className="mb-[10px]">
          <ArrowBackIcon />
        </button>
        <h2 className="auth-title">{t("title")}</h2>
        <p className="text-dolphin text-sm mb-[5px] max-w-[369px]">
          {t("desc-1")} {locale === "uz"
            ? ` ${maskedTo} ${isEmail ? t("email") : t("number")} `
            : ` ${isEmail ? t("email") : t("number")} ${maskedTo} `}
          {t("desc-2")}
        </p>
        <p className="text-dolphin text-sm">
          {t("desc-3")}
        </p>
      </div>
      {/* otp */}
      <div className="mt-[30px]">
        <InputOTP
          maxLength={4}
          value={code}
          onChange={(val) => setCode(val)}
          inputMode="numeric"
          pattern="[0-9]*"
          onKeyDown={onlyDigits}
          onPaste={onlyDigits}
        >
          <InputOTPGroup className="gap-2 md:gap-[15px] grid grid-cols-4 w-full sm:flex">
            {[0, 1, 2, 3].map((i) => (
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
                className="text-[24px] xs:w-full sm:w-[55px] h-[55px] md:text-[30px] bg-dustColor/[3%] focus-visible:ring-1 !rounded-[10px] text-textColor border"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex justify-between items-center mt-[25px]">
        <button
          onClick={handleResend}
          disabled={timer > 0}
          className={`text-mainColor font-medium ${timer > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {t("resell")}
        </button>
        <span className="text-textColor text-base font-medium">
          {minutes}:{seconds}
        </span>
      </div>
      {/* button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] sm:gap-[27px] mt-auto sm:mt-20">
        <Button
          variant={"outline"}
          className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
          onClick={handleBack}
        >
          {t("close-button")}
        </Button>
        <Button
          onClick={hanleVerify}
          disabled={code.length < 4 || isPending}
          className="flex-1 h-12 rounded-[12px]"
        >
          {isPending ? <SubmitLoader /> : t("next-button")}
        </Button>
      </div>
    </div>
  );
}
