"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ProfileForm, ProfileInfo } from "@/components/profile";
import { showSuccess } from "@/components/toast/Toast";
import { Container } from "@/components/container";
import { DataLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { UserProfile } from "@/assets/icons";
import { getUsers } from "@/api";
import {
  Bell,
  ChevronRight,
  History,
  Languages,
  ShoppingBag,
} from "lucide-react";
import { Separator } from "../ui/separator";

export function ProfilePageClient() {
  const t = useTranslations("profile");
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUsers,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      const err = error as Error & { status?: number };
      if (err.status === 401) {
        router.refresh();
        showSuccess("error", err.message);
      } else {
        showSuccess("error", err.message);
      }
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="py-20">
        <Container>
          <DataLoader />
        </Container>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-20">
      <Container>
        <h1 className="font-medium text-[28px] 3xl:text-[36px] text-textColor mb-[14px] 3xl:mb-10">
          {t("title")}
        </h1>

        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer p-5 3xl:p-[30px] border border-plasterColor rounded-[20px] bg-white mb-7.5 md:mb-2.5 3xl:mb-[30px]"
        >
          <div className="flex items-center gap-[15px] 3xl:gap-[23px]">
            <Button
              variant="outline"
              className="w-[67px] h-[67px] 3xl:w-[96px] 3xl:h-[96px] !bg-plasterColor rounded-full"
            >
              <UserProfile className="size-[39px] 3xl:size-[56px]" />
            </Button>
            <p className="flex text-[18px] 3xl:text-2xl font-semibold text-textColor">
              <span>{user.first_name}</span>
              {user.last_name && <span className="ml-1">{user.last_name}</span>}
            </p>
          </div>
        </div>

        <div className="mb-6 hidden md:block">
          {!editMode ? (
            <ProfileInfo t={t} user={user} setEditMode={setEditMode} />
          ) : (
            <ProfileForm t={t} user={user} setEditMode={setEditMode} />
          )}
        </div>

        {isOpen && (
          <div className="mb-6">
            {!editMode ? (
              <ProfileInfo t={t} user={user} setEditMode={setEditMode} />
            ) : (
              <ProfileForm t={t} user={user} setEditMode={setEditMode} />
            )}
          </div>
        )}

        {!isOpen && (
          <div className="md:hidden flex flex-col gap-5">
            <div className="bg-white rounded-[15px]">
              <Link href={"/order"} className="flex items-center justify-between px-4 py-[14px]">
                <div className="flex items-center gap-3">
                  <ShoppingBag className=" text-mainColor" />
                  <h4 className="text-[18px] text-textColor">Buyurtmalarim</h4>
                </div>
                <ChevronRight className="text-dolphin" />
              </Link>
              <Separator className="h-[1px] bg-nitrogenColor" />
              <Link href={"/order-history"} className="flex items-center justify-between px-4 py-[14px]">
                <div className="flex items-center gap-3">
                  <History className=" text-mainColor" />
                  <h4 className="text-[18px] text-textColor">Xaridlar tarixi</h4>
                </div>
                <ChevronRight className="text-dolphin" />
              </Link>
            </div>

            <div className="bg-white rounded-[15px]">
              <div className="flex items-center justify-between px-4 py-[14px]">
                <div className="flex items-center gap-3">
                  <Languages className=" text-mainColor" />
                  <h4 className="text-[18px] text-textColor">Til o’zgartirish</h4>
                </div>
                <ChevronRight className="text-dolphin" />
              </div>
              <Separator className="h-[1px] bg-nitrogenColor" />
              <Link href={"/notification"} className="flex items-center justify-between px-4 py-[14px]">
                <div className="flex items-center gap-3">
                  <Bell className=" text-mainColor" />
                  <h4 className="text-[18px] text-textColor">Bildirishnomalar</h4>
                </div>
                <ChevronRight className="text-dolphin" />
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
