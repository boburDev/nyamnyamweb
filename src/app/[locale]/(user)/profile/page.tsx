"use client";
import { getUsers } from "@/api";
import { UserProfile } from "@/assets/icons";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUsers(),
  });
  console.log("user", user);

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
              <span>{user?.first_name}</span>
              {user?.last_name && (
                <span className="ml-1">{user?.last_name}</span>
              )}
            </p>
          </div>
        </div>
        <div className="p-[30px] border border-plasterColor rounded-[20px] bg-white shadow-sm mb-[30px]">
            
        </div>
      </Container>
    </div>
  );
}
