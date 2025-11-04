"use client";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";

import useFavouriteStore from "@/context/favouriteStore";
import { useLocationStore } from "@/context/userStore";
import { useFavouritesQueryLatLon } from "@/hooks";
import { ProductCard } from "../card";
import { ProductData } from "@/types";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import { ProductSkeletons } from "../loader";

const FavouriteCart = ({ isAuth }: { isAuth: boolean }) => {
  const t = useTranslations("saved-title")
  const locale = useLocale();
  const coords = useLocationStore((s) => s.coords);
  const favourite = useFavouriteStore((s) => s.items);
  const { data: favData, isLoading } = useFavouritesQueryLatLon({
    lat: coords?.lat,
    lon: coords?.lon,
    locale: locale,
    enabled: isAuth,
  });
  const items: ProductData[] = isAuth ? favData ?? [] : favourite;

  return (
    <div>
      {isLoading || items === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-5 mt-10">
          <ProductSkeletons count={3} />
        </div>
      ) : items?.length < 0 ? (
        <div className="mt-7.5 lg:mt-12.5 2xl:mt-[76px]">
          <div className="mb-5 sm:mb-6.5 xl:mb-10">
            <h1 className="font-medium text-[22px] md:text-[28px] xl:text-[36px] text-textColor">
              {t("title")}
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-[17px] 2xl:gap-[19px]">
            {items &&
              items.map((item: ProductData) => (
                <ProductCard key={item?.id} product={item} />
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 py-2 fixed top-1/2 left-1/2 -translate-1/2 md:-translate-0 md:top-0 md:left-0 w-full md:relative">
          <div>
            <div className="flex flex-col items-center justify-center">
              <Heart className="size-15 sm:size-20 lg:size-[113px] text-dolphin/50" />
              <h2 className="text-[17px] text-center sm:text-2xl lg:text-[30px] font-semibold text-textColor mt-3 lg:mt-5">
                {t("empty.title")}
              </h2>
              <p className="text-dolphin text-center mt-2 lg:mt-[15px] text-sm sm:text-base">
                {t("empty.desc")}
              </p>
              <Link href="/">
                <Button className="font-semibold lg:text-xl lg:px-[25px] lg:!h-12 mt-3 lg:mt-5 rounded-[12px] lg:rounded-[15px]">
                  {t("empty.button")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavouriteCart;
