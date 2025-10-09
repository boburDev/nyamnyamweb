"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ProfileLogout, UserProfile } from "@/assets/icons";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "@/api";
import { userMenu } from "@/data";
import { useTranslations } from "next-intl";
export const UserMenu = () => {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const qc = useQueryClient();
  const t = useTranslations("UserMenu");
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUsers(),
  });
  const handleGoTo = (path: string) => {
    setActive(path);
    router.push(path);
  };
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout request failed", e);
    }

    qc.clear();
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-12 h-12 !bg-plasterColor">
          <UserProfile className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[308px] px-[15px] py-5 border-borderColor custom-scrollbar mr-[67px] rounded-[10px]">
        <DropdownMenuLabel className="p-0 flex items-center gap-[10px] mb-[30px]">
          <Button variant="outline" className="w-12 h-12 !bg-plasterColor">
            <UserProfile className="size-6" />
          </Button>
          <p className="font-medium text-[17px] text-textColor">
            {userData?.first_name}
          </p>
        </DropdownMenuLabel>
        <div className="flex flex-col gap-1">
          {userMenu.map(({ name, path, icon: Icon }) => (
            <DropdownMenuItem
              key={name}
              onClick={() => handleGoTo(path)}
              className={`focus:bg-mainColor/5 !font-poppins !text-sm !text-textColor cursor-pointer py-[10px] px-[10px] flex items-center gap-[9px] rounded-[10px]${
                active === name ? "bg-mainColor/5" : "bg-transparent"
              }`}
            >
              <span>{Icon && <Icon className="!w-[24px] !h-5" />}</span>
              {t(name)}
            </DropdownMenuItem>
          ))}
          <button
            onClick={handleLogout}
            className="px-[10px] rounded-[10px] py-[10px] hover:bg-mainColor/5 flex items-center gap-[9px] text-sm text-red "
          >
            <span className="pl-1">
              <ProfileLogout className="w-5 h-5" />
            </span>
            {t("logout")}
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
