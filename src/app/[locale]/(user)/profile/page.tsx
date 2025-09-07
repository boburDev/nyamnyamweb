"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/assets/icons";
import { DataLoader } from "@/components/loader";
import { ProfileForm, ProfileInfo } from "@/components/profile";
import { useState } from "react";
import { getUsers } from "@/api";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [editMode, setEditMode] = useState(false);
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUsers, 
  });

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
