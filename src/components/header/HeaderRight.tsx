"use client";

import { Link } from "@/i18n/navigation";
import {
  LanguageMenu,
  LocationMenu,
  NotificationMenu,
  UserMenu,
} from "../menu";
import { Button } from "../ui/button";
import { CartIcon, UserIcon } from "@/assets/icons";
import useCartStore from "@/context/cartStore";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/api";
import { useTranslations } from "next-intl";

const HeaderRight = ({ auth }: { auth: boolean }) => {
  const t = useTranslations("profile.profile-logout")
  const t2 = useTranslations("UserMenu")
  const guestCount = useCartStore((s) => s.items.length);
  const [isClient, setIsClient] = useState(false);
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: auth,
    refetchOnWindowFocus: false,
  });

  const serverCount = (data?.cart_items?.length as number) || 0;
  const serverTotal = (data?.cart_total as number) || 0;
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex items-center gap-2.5 xl:gap-4 ml-2.5 xl:ml-10 shrink-0">
      <LocationMenu />
      <div className="flex gap-2">
        {auth && <NotificationMenu />}
        <LanguageMenu />
      </div>

      {auth ? (
        <div className="flex items-center gap-2.5 xl:gap-4">
          <Button asChild className="max-w-[156px] xl:max-w-[170px] relative h-10.5 xl:h-12">
            <Link href="/cart">
              <div className="flex gap-[10px] xl:gap-4 py-3">
                <CartIcon />
                <span>{isClient ? serverTotal.toLocaleString() : "0"} UZS</span>
              </div>
              {isClient && serverCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {serverCount}
                </div>
              )}
            </Link>
          </Button>

          <UserMenu />
          
        </div>
      ) : (
        <div className="flex gap-2.5 xl:gap-4 items-center">
          <Link href={"https://business.azera.uz"} target="_blank">
            <Button
              variant="secondary"
              className="w-[174px] h-12 px-5 font-medium text-sm"
            >
              {t("businessButton")}
            </Button>
          </Link>

          {/* Cart Button for non-authenticated users */}
          {
            auth ? (
              <Button
            asChild
            className="w-[120px] h-12 px-3 font-medium text-sm relative"
          >
            <Link href="/cart">
              <div className="flex items-center gap-2">
                <CartIcon />
                <span>{t2("cart")}</span>
              </div>
              {isClient && guestCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {guestCount}
                </div>
              )}
            </Link>
          </Button>
            )
            : (
              null
            )
          }

          <Link href={"/signin"} className="flex">
            <Button className="w-[114px] h-12 px-5 font-medium text-sm">
              <UserIcon />
              {t("loginButton")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeaderRight;
