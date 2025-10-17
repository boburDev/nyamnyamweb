"use client";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";

import useFavouriteStore from "@/context/favouriteStore";
import { useLocationStore } from "@/context/userStore";
import { useFavouritesQueryLatLon } from "@/hooks";
import { ProductCard } from "../card";
import { ProductData } from "@/types";
import { Button } from "../ui/button";

const FavouriteCart = ({ isAuth }: { isAuth: boolean }) => {
  const coords = useLocationStore((s) => s.coords);
  const favourite = useFavouriteStore((s) => s.items);
  const { data: favData } = useFavouritesQueryLatLon({
    lat: coords?.lat,
    lon: coords?.lon,
  });
  const items: ProductData[] = isAuth ? favData ?? [] : favourite;

  return (
    <div>
      {items?.length > 0 ? (
        <div className=" mt-[76px] pb-[45px]">
          <div className="mb-10">
            <h1 className="text-4xl font-medium text-textColor">
              Saqlangan mahsulotlar
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {items &&
              items.map((item: ProductData) => (
                <ProductCard key={item?.id} product={item} />
              ))}
          </div>
        </div>
      ) : (
        <div className=" bg-gray-50 py-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center pt-[127px]">
              <Heart size={113} className="text-[#BCBEC3]" />
              <h2 className="text-[30px] font-semibold text-textColor mt-5">
                Sevimli mahsulotlarda hech narsa yo‘q
              </h2>
              <p className="text-dolphin mt-[15px]">
                Surprise baglarni tanlab, savatingizni to‘ldiring.
              </p>
              <Link href="/">
                <Button className="font-semibold text-xl px-[25px] !h-12 mt-5">
                  Surprise baglarni ko’rish
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
