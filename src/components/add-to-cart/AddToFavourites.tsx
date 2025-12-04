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
import { useTranslations } from "next-intl";

interface Props {
  product: ProductData;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
}

export const AddToFavourites = ({ product, showText = false, className }: Props) => {
  const t = useTranslations("saved-title");
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
          title: t("removed"),
          type: "info",
        });
      } else {
        addFavouritesApi(
          { id: product.id , weekday: product.weekday  },
          {
            onSuccess: () => {
              showToast({
                title: t("added"),
                type: "success",
                href: "/favourites",
                hrefName: t("title"),
              });
            },
          }
        );
      }
    } else {
      if (isFavourite) {
        deleteFavourite(product.id);
        showToast({
          title: t("removed"),
          type: "info",
        });
      } else {
        addToFavourites(product);
        showToast({
          title: t("added"),
          type: "success",
          href: "/favourites",
          hrefName: t("title"),
        });
      }
    }
  };

  return (
    <button
      onClick={handleFavourite}
      className={`
                backdrop-blur-sm bg-mainColor/30 hover:!bg-mainColor/20 text-white w-[37px] h-[37px] flex items-center justify-center rounded-full ${className}
            
      `}
      // variant={variant}
    >
      <Heart
        className={`w-6 h-6 rounded-full ${isFavourite ? " fill-white" : ""} `}
      />
      {showText && (
        <span className="ml-2">{isFavourite ? t("saved") : t("save")}</span>
      )}
    </button>
  );
};

export default AddToFavourites;
