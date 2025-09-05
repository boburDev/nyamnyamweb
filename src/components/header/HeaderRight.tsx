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

const HeaderRight = ({ auth }: { auth: boolean }) => {
  const { getUniqueItemsCount, getTotalPrice } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex items-center gap-4 ml-10 shrink-0">
      <LocationMenu />
      <div className="flex gap-2">
        <NotificationMenu />
        <LanguageMenu />
      </div>

      {auth ? (
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="w-[170px] relative"
          >
            <Link href="/cart">
              <div className="flex gap-4 py-3">
                <CartIcon />
                <span>{isClient ? getTotalPrice().toLocaleString() : '0'} UZS</span>
              </div>
              {isClient && getUniqueItemsCount() > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {getUniqueItemsCount()}
                </div>
              )}
            </Link>
          </Button>
          <UserMenu />
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Button
            variant="secondary"
            className="w-[174px] h-12 px-5 font-medium text-sm"
          >
            Biznes uchun kirish
          </Button>

          {/* Cart Button for non-authenticated users */}
          <Button
            asChild
            className="w-[120px] h-12 px-3 font-medium text-sm relative"
          >
            <Link href="/cart">
              <div className="flex items-center gap-2">
                <CartIcon />
                <span>Savat</span>
              </div>
              {isClient && getUniqueItemsCount() > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {getUniqueItemsCount()}
                </div>
              )}
            </Link>
          </Button>

          <Button className="w-[114px] h-12 px-5 font-medium text-sm">
            <Link href={"/signin"} className="flex">
              <UserIcon />
              Kirish
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderRight;
