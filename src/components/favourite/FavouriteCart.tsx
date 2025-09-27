"use client";

import React from "react";
import Image from "next/image";
import { Star, Bookmark, ShoppingCart, Dot } from "lucide-react";
import { Button } from "../ui/button";
import useFavouriteStore from "@/context/favouriteStore";
import useCartStore from "@/context/cartStore";
import { showToast } from "../toast/Toast";
import { Product } from "@/api/product";
import PriceFormatter from "../price-format/PriceFormatter";
import { formatPrice } from "@/utils/price-format";
import { ProductSkeletons } from "../loader";
import { useFavouritesQuery, useAddFavourites, useRemoveFavourites } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/user";
import { CartData } from "@/types";

type FavouriteUI = {
  id: string;
  image: string;
  name: string;
  restaurant: string;
  distance: number;
  currentPrice: number;
  originalPrice: number;
  rating?: number;
  isInCart?: boolean;
};

interface Props {
  isLoading?: boolean
}

const FavouriteCart = ({ isLoading = false }: Props) => {
  const { items, removeFromFavourites, addToFavourites, isFavourite } = useFavouriteStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: getUsers });
  const isAuth = Boolean(user);
  const { data: favData, isLoading: favLoading } = useFavouritesQuery(isAuth);
  const { mutate: addFav } = useAddFavourites();
  const { mutate: removeFav } = useRemoveFavourites();

  const toggleCart = (item: Product | FavouriteUI) => {
    if (isInCart(String(item.id))) {
      removeFromCart(String(item.id));
      showToast({
        title: "Savatdan o'chirildi",
        type: "info",
      });
    } else {
      addToCart(item as Product);
      showToast({
        title: "Savatga qo'shildi",
        type: "success",
        href: "/cart",
        hrefName: "Savatga o'tish",
      });
    }
  };

  const toggleFavourite = (item: Product | FavouriteUI) => {
    if (isAuth) {
      const favs = (favData?.data as CartData[] | undefined) || [];
      const favIdSet = new Set<string>(
        favs.map((f) => String((f as unknown as { id?: string | number; surprise_bag?: string | number }).id ?? (f as unknown as { id?: string | number; surprise_bag?: string | number }).surprise_bag))
      );
      if (favIdSet.has(String(item.id))) {
        removeFav([String(item.id)]);
        showToast({ title: "Sevimlilardan o'chirildi", type: "info" });
      } else {
        addFav([String(item.id)]);
        showToast({ title: "Sevimlilarga qo'shildi", type: "success" });
      }
    } else {
      if (isFavourite(String(item.id))) {
        removeFromFavourites(String(item.id));
        showToast({ title: "Sevimlilardan o'chirildi", type: "info" });
      } else {
        addToFavourites(item as Product);
        showToast({ title: "Sevimlilarga qo'shildi", type: "success" });
      }
    }
  };

  const apiList: CartData[] = (favData?.data as CartData[] | undefined) || [];
  const apiMapped: FavouriteUI[] = apiList.map((f) => {
    const fd = f as unknown as {
      id?: string | number;
      surprise_bag?: string | number;
      surprise_bag_image: string;
      title: string;
      branch_name: string;
      distance_km?: number | string;
      price?: number | string;
      price_in_app?: number | string
    };
    return {
      id: String(fd.id ?? fd.surprise_bag),
      image: fd.surprise_bag_image,
      name: fd.title,
      restaurant: fd.branch_name,
      distance: Number(fd.distance_km ?? 0),
      currentPrice: Number(fd.price_in_app ?? 0),
      originalPrice: Number(fd.price ?? 0),
    };
  });

  const guestMapped: FavouriteUI[] = items.map((p) => {
    const pd = p as unknown as {
      id: string;
      image: string;
      name: string;
      restaurant: string;
      distance?: number | string;
      currentPrice?: number | string;
      originalPrice?: number | string;
      rating?: number;
      isInCart?: boolean;
    };
    return {
      id: String(pd.id),
      image: pd.image,
      name: pd.name,
      restaurant: pd.restaurant,
      distance: Number(pd.distance ?? 0),
      currentPrice: Number(pd.currentPrice ?? 0),
      originalPrice: Number(pd.originalPrice ?? 0),
      rating: pd.rating,
      isInCart: pd.isInCart,
    };
  });

  const list: FavouriteUI[] = isAuth ? apiMapped : guestMapped;

  if (list.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-textColor mb-2">
          Saqlangan mahsulotlar yo'q
        </h2>
        <p className="text-dolphin">
          Mahsulotlarni saqlash uchun bookmark tugmasini bosing
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        (isLoading || favLoading) ? (
          <ProductSkeletons count={6} />
        ) : (
          list.map((item: FavouriteUI) => (
            <div key={item.id} className="px-[5.5px]">
              <div className="bg-white rounded-[25px] border border-gray-100">
                {/* Product Image */}
                <div className="relative h-[200px]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover rounded-t-[25px]"
                  />

                  {/* Stock Badge */}
                  {/* no stock info for unified item */}
                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleFavourite(item)}
                    className="absolute top-3 right-3 px-[9px] py-[6.5px] bg-white rounded-[15px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Bookmark className="w-6 h-6 stroke-mainColor fill-mainColor" />

                  </button>
                </div>

                {/* Product Details */}
                <div className="p-5">
                  {/* Rating and Name */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star
                        fill="#F8B133"
                        stroke="#F8B133"
                        className="w-4 h-4"
                      />
                      <span className="text-textColor font-medium text-sm">
                        {item.rating}
                      </span>
                    </div>
                    <span className="text-textColor font-medium text-lg">{item.name}</span>
                  </div>

                  {/* Restaurant and Distance */}
                  <div className="flex items-center gap-1 mb-3 text-dolphin text-sm">
                    <span className="font-medium">{item.restaurant}</span>
                    <Dot className="w-4 h-4" />
                    <span className="font-medium">{item.distance} km</span>
                  </div>

                  <div className="flex gap-[10px] justify-between items-center">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <PriceFormatter amount={item.currentPrice} className="text-lg max-w-[104px] truncate" />
                      <span className="text-dolphin line-through text-sm flex-shrink-0">
                        {formatPrice(item.originalPrice)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleCart(item)}
                        className={`flex-1 h-10 rounded-lg flex items-center justify-center transition-colors hover:!text-white ${isInCart(item.id) || item.isInCart
                          ? "bg-mainColor text-white"
                          : "bg-gray-100 !text-mainColor hover:bg-gray-200"
                          }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                      <Button className="flex-1 h-10 bg-gray-100 !text-mainColor rounded-lg hover:!text-white font-medium hover:bg-gray-200 transition-colors">
                        Batafsil
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )
      }
    </div>
  );
};

export default FavouriteCart;
