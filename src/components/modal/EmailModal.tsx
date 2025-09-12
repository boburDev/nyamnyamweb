"use client";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import request from "@/services";
import { UPDATE_ME } from "@/constants";
import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/context/useAuth";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SubmitLoader } from "../loader";
import axios, { AxiosError } from "axios";
import { showError } from "../toast/Toast";
import { useMutation } from "@tanstack/react-query";

interface Props {
  open: boolean;
  toggleOpen: () => void;
  email: string;
}
type FormValues = { email: string };

export const EmailModal = ({ open, toggleOpen, email }: Props) => {
  const t = useTranslations("profile");
  const setTo = useAuthStore((s) => s.setTo);
  const router = useRouter();
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ email });
    }
  }, [open, email, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await axios.patch(
        '/api/email-phone',
        { email: data.email },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": locale,
          },
        }
      );
  
      return res.data;
    },
    onSuccess: (_, variables) => {
      setTo(variables.email);
      router.push("/update-profile");
      toast.success(t("sentEmail", { email: variables.email }));
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error_message || error.message || "Something went wrong";
      showError(message);
    },
  });
  

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="
          px-10 pt-7 pb-[36px]
          w-[80%] md:max-w-[480px]
          rounded-[10px] sm:rounded-[20px]
         md:-mt-0 -mt-14 border-none
        "
      >
        <DialogHeader>
          <DialogTitle className="text-textColor font-semibold text-xl">
            {t("emailTitle")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden"></DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-[5px] text-textColor font-normal text-xs lg:text-sm"
            >
              {t("email")}
            </label>

            <Input
              autoComplete="username"
              id="email"
              type="email"
              {...register("email", {
                required: "Email kiritilishi shart",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "To‘g‘ri email kiriting",
                },
              })}
              className="text-textColor border-mounSnow cursor-pointer rounded-[12px] h-12 py-[11px] px-[15px]"
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending || !isDirty}
            className="w-full mt-10"
          >
            {mutation.isPending ? <SubmitLoader /> : t("send")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
