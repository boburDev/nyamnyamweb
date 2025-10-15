"use client";

import Image from "next/image";
import { Star, Dot } from "lucide-react";
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
    <div>
      <div className="bg-white rounded-[25px] border border-gray-100">
        {/* Product Image */}
        <div className="relative h-[200px]">
          <Image
            src={
              product.cover_image ||
              product.surprise_bag_image ||
              "/images/placeholder.png"
            }
            alt={product.title ?? "Mahsulot rasmi"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover rounded-t-[25px]"
          />

          {/* Stock Badge */}
          {product.count && product.count <= 5 && (
            <div className="absolute top-3 left-3 bg-mainColor/20 rounded-full px-[14px] py-2 text-sm font-medium text-white backdrop-blur-[45px]">
              {product.count} ta qoldi
            </div>
          )}

          {/* Favourite Button */}
          <div className="absolute top-3 right-3">
            <AddToFavourites product={product} />
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5">
          {/* Rating and Name */}

          <p className="text-textColor font-medium text-lg line-clamp-1 mb-4">
            {product.title}
          </p>

          {/* Business name + Branch + Distance */}
          <div className="flex justify-between items-center mb-[19px]">
            <div className="flex items-center gap-1  text-dolphin text-sm">
              {product.branch_name && (
                <span className="font-medium">{product.branch_name}</span>
              )}
              {product.distance && (
                <>
                  <Dot className="w-4 h-4" />
                  <span className="font-medium">{product.distance}</span>
                </>
              )}
            </div>
            {(product?.overall_rating ?? 0) >= 0 && (
              <div className="flex items-center gap-1">
                <Star fill="#F8B133" stroke="#F8B133" className="w-4 h-4" />
                <span className="text-textColor font-medium text-sm">
                  {product.overall_rating ?? 0}
                </span>
              </div>
            )}
          </div>

          {/* Price + Buttons */}
          <div className="flex gap-[10px] justify-between items-center">
            {/* Price */}
            <div className="flex items-end gap-2">
              <PriceFormatter
                amount={product.price_in_app}
                className="text-[22px] text-mainColor font-semibold"
              />
              {product.price && (
                <span className="text-dolphin  line-through text-sm leading-[21px]">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <AddToCart product={product} className="flex-1" />
              <Link
                href=""
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/surprise-bag/${product.id}`);
                }}
              >
                <Button className="w-full h-10 bg-gray-100 !text-mainColor rounded-lg hover:!text-white font-medium hover:bg-gray-200 transition-colors">
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
