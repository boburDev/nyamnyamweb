"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";

import { showError, showSuccess } from "../toast/Toast";
import { EmailModal, PhoneModal } from "../modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "../phone-input";
import { SubmitLoader } from "../loader";
import { TFunction } from "@/utils/i18n";
import { UserData } from "@/types";
import { useUpdateUser } from "@/hooks";

interface Props {
  t: TFunction;
  user: UserData;
  setEditMode: (value: boolean) => void;
}

export const ProfileForm = ({ t, user, setEditMode }: Props) => {
  const [phone, setPhone] = useState<string>(
    user?.phone_number || "+998 __ ___ ____"
  );
  const locale = useLocale();
  const [openPhone, setOpenPhone] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const { mutate: updateUser, isPending } = useUpdateUser(locale);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isDirty, isSubmitting, dirtyFields },
  } = useForm<UserData>({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      birth_date: user?.birth_date || "",
      phone_number: user?.phone_number || "",
      email: user?.email || "",
      password: "",
    },
  });
  const onSubmit = () => {
    const allValues = getValues();
    const payload: Partial<UserData> = {};
    (Object.keys(dirtyFields) as (keyof UserData)[]).forEach((key) => {
      let val = allValues[key];
      if (key === "birth_date" && typeof val === "undefined") {
        val = "";
      }
      if (val !== undefined) {
        payload[key] = val;
      }
    });
    updateUser(payload as UserData, {
      onSuccess: () => {
        showSuccess(t("updated"));
        setEditMode(false);
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
    <div className="pt-[19px] px-[30px] border border-plasterColor rounded-[20px] bg-white shadow-sm">
      <div className="flex justify-between items-center pb-[19px] border-b border-input">
        <h3 className="font-medium text-[22px] text-textColor">
          {t("about-title")}
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-[34px] pb-[42px]">
        <div className="flex gap-10 mb-[29px]">
          {/* First name */}
          <div className="flex flex-col gap-2 min-w-[255px]">
            <label className="profile-label">{t("first_name")}</label>
            <Input
              {...register("first_name")}
              placeholder={t("first_name")}
              className="text-textColor rounded-[12px] border-mounSnow h-12 py-[11px] px-[15px]"
            />
          </div>

          {/* Last name */}
          <div className="flex flex-col gap-2 min-w-[300px]">
            <label className="profile-label">{t("last_name")}</label>
            <Input
              {...register("last_name")}
              placeholder={t("last_name")}
              className="text-textColor border-mounSnow rounded-[12px] h-12 py-[11px] px-[15px]"
            />
          </div>

          {/* Birth date */}
          <div className="flex flex-col gap-2">
            <label className="profile-label">{t("birth_date")}</label>
            <Input
              type="date"
              {...register("birth_date")}
              className="text-textColor rounded-[12px] border-mounSnow h-12 py-[11px] px-[15px]"
            />
          </div>
        </div>

        <div className="flex gap-10 items-end">
          {/* Phone number */}
          <div className="flex flex-col gap-2 min-w-[255px]">
            <label className="profile-label">{t("phone_number")}</label>
            <PhoneInput
              id="phoneNumber"
              onClick={() => setOpenPhone(true)}
              value={phone}
              onChange={setPhone}
              readOnly
              className="text-textColor border h-12 border-mounSnow py-[11px] px-[15px] rounded-[12px] focus:outline-none cursor-pointer"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 min-w-[300px]">
            <label className="profile-label">{t("email")}</label>
            <Input
              onClick={() => setOpenEmail(true)}
              type="email"
              {...register("email")}
              placeholder="example@mail.com"
              readOnly
              className="text-textColor border-mounSnow cursor-pointer rounded-[12px] h-12 py-[11px] px-[15px]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 min-w-[255px]">
            <label className="profile-label">{t("password")}</label>
            <Input
              type="password"
              {...register("password")}
              placeholder="**********"
              className="text-textColor h-12 rounded-[12px] border-mounSnow py-[11px] px-[15px]"
            />
          </div>

          {/* Save button */}
          <div className="ml-auto">
            <Button
              type="submit"
              className="w-[176px]"
              disabled={!isDirty || isSubmitting || isPending}
            >
              {isPending ? <SubmitLoader /> : t("save")}
            </Button>
          </div>
        </div>
      </form>
      {openEmail && (
        <EmailModal
          open={openEmail}
          toggleOpen={() => setOpenEmail(!openEmail)}
          email={user?.email}
        />
      )}
      {openPhone && (
        <PhoneModal
          open={openPhone}
          toggleOpen={() => setOpenPhone(!openPhone)}
          phone={user?.phone || "+998 __ ___ ____"}
        />
      )}
    </div>
  );
};

export default ProfileForm;
