"use client";

import { AxiosError } from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { showError } from "@/components/toast/Toast";
import { Button } from "@/components/ui/button";
import { ArrowBackIcon } from "@/assets/icons";
import { useRouter } from "@/i18n/navigation";
import { useVerify } from "@/hooks/useVerify";
import useAuthStore from "@/context/useAuth";
import { useVerifyOtp } from "@/hooks";
import { useLocale, useTranslations } from "next-intl";
import { SubmitLoader } from "@/components/loader";

export default function VerifyPage() {
  const to = useAuthStore((s) => s.to);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("confirm-password");
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
  } = useVerify(to as string);
  const { mutate: verifyOtp, isPending } = useVerifyOtp(locale);
  const handleBack = () => {
    router.back();
  };
  if (!to) return null;
  const hanleVerify = () => {
    const payload = isEmail ? { email: to, code } : { phone_number: to, code };
    verifyOtp(payload, {
      onSuccess: () => {
        router.push("/signup-complete");
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
    <div className="max-w-[358px] w-full mx-auto">
      {/* top */}
      <div>
        <button onClick={handleBack} className="mb-[10px]">
          <ArrowBackIcon />
        </button>
        <h2 className="auth-title">{t("title")}</h2>
        <p className="text-dolphin text-sm mb-[5px]">
          {t("desc-1")}
          {locale === "uz"
            ? ` ${maskedTo} ${isEmail ? t("email") : t("number")} `
            : ` ${isEmail ? t("email") : t("number")} ${maskedTo} `}
          {t("desc-2")}
        </p>
        <p className="text-dolphin text-sm">{t("desc-3")}</p>
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
          <InputOTPGroup className="gap-2 md:gap-[15px] justify-center ">
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
                className="w-[40px] h-[40px] text-[24px] xs:w-[49px] xs:h-[49px] md:w-[53px] md:h-[53px] md:text-[30px] bg-dustColor/[3%] focus-visible:ring-1 !rounded-[10px] text-textColor border"
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
          {t("resell")}
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
          {t("close-button")}
        </Button>
        <Button
          onClick={hanleVerify}
          disabled={code.length < 6 || isPending}
          className="flex-1 h-12 rounded-[12px]"
        >
          {isPending ? <SubmitLoader /> : t("next-button")}
        </Button>
      </div>
    </div>
  );
}
