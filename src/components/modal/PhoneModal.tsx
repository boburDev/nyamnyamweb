"use client";
import { useEffect, useState, FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import request from "@/services";
import { useRouter } from "@/i18n/navigation";
import PhoneInput from "../phone-input/PhoneInput";
import { UPDATE_ME } from "@/constants";
import { SubmitLoader } from "../loader";
import { Button } from "../ui/button";
import { showError, showSuccess } from "../toast/Toast";
import useAuthStore from "@/context/useAuth";
import { AxiosError } from "axios";

interface Props {
  open: boolean;
  toggleOpen: () => void;
  phone: string;
}

export const PhoneModal = ({ open, toggleOpen, phone }: Props) => {
  const t = useTranslations("profile");
  const router = useRouter();
  const locale = useLocale();
  const setTo = useAuthStore((s) => s.setTo);

  const [val, setVal] = useState<string>(phone);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setVal(phone);
    }
  }, [open, phone]);

  const isDisabled = loading || val === phone || val.trim() === "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    const normalizePhone = (phone: string) => phone.replace(/\s+/g, "");
    const normalizedVal = normalizePhone(val);
    try {
      setLoading(true);
      await request.patch(
        `${UPDATE_ME}`,
        {
          phone: normalizedVal,
        },
        {
          headers: {
            "Accept-Language": locale,
          },
        }
      );
      setTo(normalizedVal);
      router.push("/update-profile");
      showSuccess(t("sentPhone", { phone: normalizedVal }));
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.error_message;
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="px-10 pt-7 pb-[36px] w-[80%] md:max-w-[480px] rounded-[10px] sm:rounded-[20px]  -mt-14 md:-mt-0 border-none"
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
            {loading ? <SubmitLoader /> : t("send")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneModal;
