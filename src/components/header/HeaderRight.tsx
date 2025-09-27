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

const HeaderRight = ({ auth }: { auth: boolean }) => {
  const { getUniqueItemsCount, getTotalPrice } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const cartStore = useCartStore((s) => s.items);
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: auth,
  });
  const items = auth ? data : cartStore;
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
          <Button asChild className="w-[170px] relative">
            <Link href="/cart">
              <div className="flex gap-4 py-3">
                <CartIcon />
                <span>
                  {isClient ? getTotalPrice().toLocaleString() : "0"} UZS
                </span>
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
              {isClient && items?.length > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {items?.length}
                </div>
              )}
            </Link>
          </Button>

          <Link href={"/signin"} className="flex">
            <Button className="w-[114px] h-12 px-5 font-medium text-sm">
              <UserIcon />
              Kirish
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeaderRight;
