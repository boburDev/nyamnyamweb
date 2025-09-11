"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ProfileForm, ProfileInfo } from "@/components/profile";
import { showSuccess } from "@/components/toast/Toast";
import { Container } from "@/components/container";
import { DataLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { UserProfile } from "@/assets/icons";
import { getUsers } from "@/api";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [editMode, setEditMode] = useState(false);
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
        <h1 className="page-title mb-10">{t("title")}</h1>

        <div className="p-[30px] border border-plasterColor rounded-[20px] bg-white shadow-sm mb-[30px]">
          <div className="flex items-center gap-[23px]">
            <Button
              variant="outline"
              className="w-[96px] h-[96px] !bg-plasterColor rounded-full"
            >
              <UserProfile className="size-[56px]" />
            </Button>
            <p className="flex text-2xl font-semibold text-textColor">
              <span>{user.first_name}</span>
              {user.last_name && <span className="ml-1">{user.last_name}</span>}
            </p>
          </div>
        </div>

        {!editMode ? (
          <ProfileInfo t={t} user={user} setEditMode={setEditMode} />
        ) : (
          <ProfileForm t={t} user={user} setEditMode={setEditMode} />
        )}
      </Container>
    </div>
  );
}
