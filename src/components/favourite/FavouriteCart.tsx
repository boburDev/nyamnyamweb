"use client";
import useFavouriteStore from "@/context/favouriteStore";
import { useFavouritesQuery } from "@/hooks";
import { ProductCard } from "../card";
import { ProductData } from "@/types";

const FavouriteCart = ({ isAuth }: { isAuth: boolean }) => {
  const favourite = useFavouriteStore((s) => s.items);
  const { data: favData } = useFavouritesQuery(isAuth);  
  const items: ProductData[] = isAuth
    ? favData && Array.isArray(favData.data)
      ? favData.data
      : []
    : favourite;
  return (
    <div className="grid grid-cols-3 gap-5">
      {items &&
        items.map((item: ProductData) => (
          <ProductCard key={item?.id} product={item} />
        ))}
    </div>
  );
};

export default FavouriteCart;
