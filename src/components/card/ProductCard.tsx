"use client";

import Image from "next/image";
import { Star, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AddToCart, FavouriteButton } from "../add-to-cart";
import PriceFormatter from "../price-format/PriceFormatter";
import { formatPrice } from "@/utils/price-format";
import { useRouter } from "next/navigation";

interface Item {
  id: string;
  cover_image?: string;
  title?: string;
  business_name?: string;
  branch_name?: string;
  price_in_app?: number;
  currency?: string;
  rating?: number;
  stock?: number;
  distance?: number;
  original_price?: number;
}

interface ProductCardProps {
  item: Item;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const router = useRouter();
  return (
    <div className="px-[5.5px]">
      <div className="bg-white rounded-[25px] border border-gray-100">
        {/* Product Image */}
        <div className="relative h-[200px]">
          <Image
            src={item.cover_image ?? '/productimg.png'}
            alt={item.title ?? 'Mahsulot rasmi'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover rounded-t-[25px]"
          />

          {/* Stock Badge */}
          {item.stock && item.stock <= 5 && (
            <div className="absolute top-3 left-3 bg-mainColor/20 rounded-full px-[14px] py-2 text-sm font-medium text-white backdrop-blur-[45px]">
              {item.stock} ta qoldi
            </div>
          )}

          {/* Favourite Button */}
          <div className="absolute top-3 right-3">
            <FavouriteButton product={item} size="md" />
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5">
          {/* Rating and Name */}
          <div className="flex items-center gap-2 mb-3">
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star fill="#F8B133" stroke="#F8B133" className="w-4 h-4" />
                <span className="text-textColor font-medium text-sm">
                  {item.rating}
                </span>
              </div>
            )}
            <span className="text-textColor font-medium text-lg line-clamp-1">
              {item.title}
            </span>
          </div>

          {/* Business name + Branch + Distance */}
          <div className="flex items-center gap-1 mb-3 text-dolphin text-sm">
            <span className="font-medium">{item.business_name}</span>
            {item.branch_name && (
              <>
                <Dot className="w-4 h-4" />
                <span className="font-medium">{item.branch_name}</span>
              </>
            )}
            {item.distance && (
              <>
                <Dot className="w-4 h-4" />
                <span className="font-medium">{item.distance} km</span>
              </>
            )}
          </div>

          {/* Price + Buttons */}
          <div className="flex gap-[10px] justify-between items-center">
            {/* Price */}
            <div className="flex items-center gap-2">
              <PriceFormatter
                amount={item.price_in_app}
                className="text-lg text-textColor font-semibold"
              />
              {item.original_price && (
                <span className="text-dolphin line-through text-sm flex-shrink-0">
                  {formatPrice(item.original_price)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <AddToCart product={item} className="flex-1" />
              <Link href='' className="flex-1" onClick={(e) => {
                  e.preventDefault();
                  router.push(`/surprise-bag/${item.id}`);
                }}>
                <Button
                  className="w-full h-10 bg-gray-100 !text-mainColor rounded-lg hover:!text-white font-medium hover:bg-gray-200 transition-colors"
                >
                  Batafsil
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
