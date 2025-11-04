"use client";

import { useEffect, useState, FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRouter } from "@/i18n/navigation";
import PhoneInput from "../phone-input/PhoneInput";
import { SubmitLoader } from "../loader";
import { Button } from "../ui/button";
import { showError, showSuccess } from "../toast/Toast";
import useAuthStore from "@/context/useAuth";
import { AxiosError } from "axios";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface Props {
  open: boolean;
  toggleOpen: () => void;
  phone: string;
}

export const PhoneModal = ({ open, toggleOpen, phone }: Props) => {
  const t = useTranslations("profile");
  const tToast = useTranslations("toast");
  const router = useRouter();
  const locale = useLocale();
  const setTo = useAuthStore((s) => s.setTo);

  const [val, setVal] = useState<string>(phone);

  useEffect(() => {
    if (open) {
      setVal(phone);
    }
  }, [open, phone]);

  const mutation = useMutation({
    mutationFn: async (phone: string) => {
      const normalized = phone.replace(/\s+/g, "");
      return axios.patch(
        "/api/email-phone",
        { phone_number: normalized },
        {
          headers: {
            "Accept-Language": locale,
          },
        }
      );
    },
    onSuccess: (_, phone) => {
      const normalized = phone.replace(/\s+/g, "");
      setTo(normalized);
      router.push("/update-profile");
      showSuccess(t("sentPhone", { phone: normalized }));
      toggleOpen(); // modalni yopib qo'yish
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.error_message;
        showError(message || tToast("error-unknown"));
      } else {
        showError(tToast("error-unexpected"));
      }
    },
  });

  const isDisabled =
    mutation.isPending || val === phone || val.trim() === "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    mutation.mutate(val);
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="px-10 pt-7 pb-[36px] w-[80%] md:max-w-[480px] rounded-[10px] sm:rounded-[20px] -mt-14 md:-mt-0 border-none"
      >
        <DialogHeader>
          <DialogTitle className="text-textColor font-semibold text-xl">
            {t("phoneTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <div className="flex flex-col">
            <label htmlFor="phoneNumber" className="profile-label mb-2">
              {t("phone_number")}
            </label>
            <PhoneInput
              id="phoneNumber"
              value={val}
              onChange={setVal}
              className="text-textColor border h-12 border-mounSnow py-[11px] px-[15px] rounded-[12px] focus:outline-none select-none"
            />
          </div>

          <Button type="submit" disabled={isDisabled} className="w-full mt-10">
            {mutation.isPending ? <SubmitLoader /> : t("send")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneModal;
