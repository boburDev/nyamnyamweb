"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AddToCart, AddToFavourites } from "../add-to-cart";
import PriceFormatter from "../price-format/PriceFormatter";
import { formatPrice } from "@/utils/price-format";
import { ProductData } from "@/types";

interface ProductCardProps {
  product: ProductData;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-full block md:hidden rounded-[15px]"
        onClick={(e) => {
          e.preventDefault();
          router.push(`/surprise-bag/${product?.id}`);
        }}></div>
      <div className="bg-white rounded-[15px] xl:rounded-t-[20px] xl:rounded-b-[25px] overflow-hidden border border-gray-100">
        {/* Product Image */}
        <div className="relative h-[165px] xl:h-[200px]">
          <Image
            src={product?.cover_image}
            alt={product?.title ?? "Mahsulot rasmi"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover rounded-[15px] xl:rounded-[20px]"
          />

          {/* Stock Badge */}
          {product?.count && product?.count <= 5 && (
            <div className="absolute top-2.5 left-2.5 xl:top-3 xl:left-3 bg-mainColor/30 rounded-[10px] xl:rounded-full px-2.5 xl:px-[14px] py-[5px] xl:py-2 text-[10px] xl:text-sm font-medium text-white backdrop-blur-sm">
              {product?.count} ta qoldi
            </div>
          )}

          {/* Favourite Button */}
          <div className="absolute top-2.5 right-2.5 xl:top-3 xl:right-3">
            <AddToFavourites product={product} />
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3 xl:p-5">
          {/* Rating and Name */}

          <p className="text-textColor font-medium text-base xl:text-lg line-clamp-1 mb-2.5 xl:mb-4">
            {product?.title}
          </p>

          {/* Business name + Branch + Distance */}
          <div className="flex justify-between items-center mb-2 xl:mb-[19px]">
            <div className="flex items-center gap-1 text-dolphin text-xs xl:text-sm">
              {product?.branch_name && (
                <span className="xl:font-medium">{product?.branch_name}</span>
              )}
              {product?.distance && (
                <>
                  <span>•</span>
                  <span className="xl:font-medium">{product?.distance}</span>
                </>
              )}
            </div>
            {(product?.overall_rating ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Star fill="#F8B133" stroke="#F8B133" className="size-3.5 xl:size-4" />
                <span className="text-textColor font-medium text-xs xl:text-sm">
                  {product?.overall_rating ?? 0}
                </span>
              </div>
            )}
          </div>

          {/* Price + Buttons */}
          <div className="flex xl:gap-[10px] justify-between items-center">
            {/* Price */}
            <div className="flex flex-col xl:flex-row xl:items-end xl:gap-2">
              <PriceFormatter
                amount={product?.price_in_app}
                className="text-base xl:text-[22px] text-mainColor font-semibold"
              />
              {product?.price && (
                <span className="text-dolphin line-through text-xs xl:text-sm xl:leading-[26px]">
                  {formatPrice(product?.price)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <AddToCart product={product} className="flex-1 rounded-[12px]" />
              <Link
                href=""
                className="hidden md:flex flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/surprise-bag/${product?.id}`);
                }}
              >
                <Button className="w-full h-10 px-3 3xl:px-5 bg-gray-100 !text-mainColor rounded-lg hover:!text-white font-medium hover:bg-gray-200 transition-colors">
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
