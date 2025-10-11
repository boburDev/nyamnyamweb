"use client";

import React from "react";
import { Heart } from "lucide-react";
import useFavouriteStore from "@/context/favouriteStore";
import { showToast } from "../toast/Toast";
import { useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAddFavourites, useRemoveFavourites } from "@/hooks";
import { getFavourites } from "@/api/favourite";
import { useAuthStatus } from "@/hooks/auth-status";
import { ProductData } from "@/types";

interface FavouriteButtonProps {
  product: ProductData;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  product,
  showText = false,
}) => {
  const { addToFavourites, isFavourite } = useFavouriteStore();
  const router = useRouter();
  const { isAuthenticated: isAuth } = useAuthStatus();
  const { mutate: addFavouritesApi } = useAddFavourites();
  const { mutate: removeFavouriteApi } = useRemoveFavourites();
  const { data: favData } = useQuery<{ success: boolean; data: ProductData[] }>(
    {
      queryKey: ["favourites"],
      queryFn: getFavourites,
      enabled: isAuth,
    }
  );

  const handleFavourite = () => {
    const inLocalFav = isFavourite(product.id);

    // Auth bo'lsa serverdagi favourite-larni tekshiramiz
    const matchedFavourite = favData?.data?.find(
      (item: ProductData) =>
        String(item.surprise_bag) === String(product.id)
    );

    const inServerFav = Boolean(matchedFavourite);
    const isFav = inLocalFav || inServerFav;

    if (isFav) {
      if (isAuth) {
        // ❗️To‘g‘ri id yuborish kerak
        if (matchedFavourite?.id) {
          removeFavouriteApi({ id: matchedFavourite.id });
        } else {
          console.warn("Favourite id topilmadi");
        }
      } else {
        useFavouriteStore.getState().removeFromFavourites(product.id);
      }

      showToast({
        title: "Mahsulot saqlanganlardan olib tashlandi",
        type: "info",
      });
      return;
    }

    if (isAuth) {
      addFavouritesApi(
        { id: product.id }, // yoki product.surprise_bag, agar backend shuni kutsa
        {
          onSuccess: () => {
            showToast({
              title: "Saqlangan mahsulotlarga qo'shildi",
              type: "success",
              href: "/favourites",
              hrefName: "Saqlangan mahsulotlar",
            });
          },
        }
      );
    } else {
      addToFavourites(product);
      showToast({
        title: "Saqlangan mahsulotlarga qo'shildi",
        type: "success",
        href: "/favourites",
        hrefName: "Saqlangan mahsulotlar",
      });
    }
  };



  const isFavouriteState =
    isFavourite(product.id) ||
    (isAuth &&
      favData?.data?.some(
        (item: ProductData) => String(item.surprise_bag) === String(product.id)
      ));

  return (
    <button
      onClick={handleFavourite}
      className={`
                backdrop-blur-[45px] bg-mainColor/20 hover:!bg-mainColor/20 text-white w-[37px] h-[37px] flex items-center justify-center rounded-full
            
      `}
    // variant={variant}
    >
      <Heart
        className={`w-6 h-6 rounded-full ${isFavouriteState ? " fill-white" : ""
          } `}
      />
      {showText && (
        <span className="ml-2">
          {isFavouriteState ? "Saqlangan" : "Saqlash"}
        </span>
      )}
    </button>
  );
};

export default FavouriteButton;
