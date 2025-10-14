"use client";

import React from "react";
import { Heart } from "lucide-react";
import useFavouriteStore from "@/context/favouriteStore";
import { showToast } from "../toast/Toast";
import {
  useAddFavourites,
  useFavouritesQuery,
  useRemoveFavourites,
} from "@/hooks";
import { useAuthStatus } from "@/hooks/auth-status";
import { ProductData } from "@/types";
import { isProductInList } from "@/utils";

interface Props {
  product: ProductData;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
}

export const AddToFavourites = ({ product, showText = false }: Props) => {
  const addToFavourites = useFavouriteStore((s) => s.addToFavourites);
  const items = useFavouriteStore((s) => s.items);
  const deleteFavourite = useFavouriteStore((s) => s.removeFromFavourites);
  const { isAuthenticated: isAuth } = useAuthStatus();
  const { mutate: addFavouritesApi } = useAddFavourites();
  const { mutate: removeFavouriteApi } = useRemoveFavourites();
  const { data: favData } = useFavouritesQuery(isAuth);
  const favouriteData = isAuth ? favData ?? [] : items;

  const isFavourite = isProductInList(favouriteData, product);

  const handleFavourite = () => {
    if (isAuth) {
      if (isFavourite) {
        removeFavouriteApi({
          id: product.id,
        });
        showToast({
          title: "Mahsulot saqlanganlardan olib tashlandi",
          type: "info",
        });
      } else {
        addFavouritesApi(
          { id: product.id },
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
      }
    } else {
      if (isFavourite) {
        deleteFavourite(product.id);
        showToast({
          title: "Mahsulot saqlanganlardan olib tashlandi",
          type: "info",
        });
      } else {
        addToFavourites(product);
        showToast({
          title: "Saqlangan mahsulotlarga qo'shildi",
          type: "success",
          href: "/favourites",
          hrefName: "Saqlangan mahsulotlar",
        });
      }
    }
  };

  return (
    <button
      onClick={handleFavourite}
      className={`
                backdrop-blur-[45px] bg-mainColor/20 hover:!bg-mainColor/20 text-white w-[37px] h-[37px] flex items-center justify-center rounded-full
            
      `}
      // variant={variant}
    >
      <Heart
        className={`w-6 h-6 rounded-full ${isFavourite ? " fill-white" : ""} `}
      />
      {showText && (
        <span className="ml-2">{isFavourite ? "Saqlangan" : "Saqlash"}</span>
      )}
    </button>
  );
};

export default AddToFavourites;
