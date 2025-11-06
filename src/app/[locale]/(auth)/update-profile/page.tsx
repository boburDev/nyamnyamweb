"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SubmitLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ArrowBackIcon } from "@/assets/icons";
import { useVerify } from "@/hooks/useVerify";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import { useUpdateVerify } from "@/hooks";
import { showError, showSuccess } from "@/components/toast/Toast";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateProfilePage() {
  const to = useAuthStore((s) => s.to);
  const clearTo = useAuthStore((s) => s.clearTo);
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const t = useTranslations("verify-update");
  const t2 = useTranslations("confirm-password");
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
  const { mutate: updateVerify, isPending } = useUpdateVerify(locale)

  const handleBack = () => {
    router.back();
  };

  if (!to) return null;

  const handleVerify = () => {
    const payload = isEmail ? { email: to, code } : { phone: to, code };

    updateVerify(payload, {
      onSuccess: () => {
        clearTo();
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/profile");
        showSuccess(isEmail ? t("success-email") : t("success-phone"));
      },
      onError: (error: Error | AxiosError) => {
        const message =
          error instanceof AxiosError
            ? (error.response?.data as { error?: string })?.error ||
            error.message
            : error.message;
        showError(message);
      }
    })
  };

  return (
    <div className="flex flex-col w-full h-full sm:h-auto">
      {/* top */}
      <div>
        <button onClick={handleBack} className="mb-[10px]">
          <ArrowBackIcon />
        </button>
        <h2 className="auth-title">{t2("title")}</h2>
        <p className="text-dolphin text-sm mb-[5px]">
          {t2("desc-1")} {locale === "uz"
            ? ` ${maskedTo} ${isEmail ? t2("email") : t2("number")} `
            : ` ${isEmail ? t2("email") : t2("number")} ${maskedTo} `}
          {t2("desc-2")}
        </p>
        <p className="text-dolphin text-sm">
          {t2("desc-3")}
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
          onClick={updateResend}
          disabled={timer > 0}
          className={`text-mainColor font-medium ${timer > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {t2("resell")}
        </button>
        <span className="text-textColor text-base font-medium">
          {minutes}:{seconds}
        </span>
      </div>

      {/* buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] sm:gap-[27px] mt-auto sm:mt-20">
        <Button
          variant={"outline"}
          className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
          onClick={handleBack}
        >
          {t2("close-button")}
        </Button>
        <Button
          onClick={handleVerify}
          disabled={code.length < 4 || isPending}
          className="flex-1 h-12 rounded-[12px]"
        >
          {isPending ? <SubmitLoader /> : t2("next-button")}
        </Button>
      </div>
    </div>
  );
}
