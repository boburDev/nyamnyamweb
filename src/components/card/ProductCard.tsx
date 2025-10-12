"use client";

import Image from "next/image";
import { Star, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AddToCart, FavouriteButton } from "../add-to-cart";
import PriceFormatter from "../price-format/PriceFormatter";
import { formatPrice } from "@/utils/price-format";
import { useRouter } from "next/navigation";
import { ProductData } from "@/types";

interface ProductCardProps {
  product: ProductData;
  saved?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  saved = false,
}) => {
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
            <FavouriteButton product={product} saved={saved}/>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5">
          {/* Rating and Name */}
          <div className="flex items-center gap-2 mb-3">
            {product.overall_rating && (
              <div className="flex items-center gap-1">
                <Star fill="#F8B133" stroke="#F8B133" className="w-4 h-4" />
                <span className="text-textColor font-medium text-sm">
                  {product.overall_rating}
                </span>
              </div>
            )}
            <span className="text-textColor font-medium text-lg line-clamp-1">
              {product.title}
            </span>
          </div>

          {/* Business name + Branch + Distance */}
          <div className="flex items-center gap-1 mb-3 text-dolphin text-sm">
            <span className="font-medium">{product.business_name}</span>
            {product.branch_name && (
              <>
                <Dot className="w-4 h-4" />
                <span className="font-medium">{product.branch_name}</span>
              </>
            )}
            {product.distance && (
              <>
                <Dot className="w-4 h-4" />
                <span className="font-medium">
                  {product.distance || product.distance_km}
                </span>
              </>
            )}
          </div>

          {/* Price + Buttons */}
          <div className="flex gap-[10px] justify-between items-center">
            {/* Price */}
            <div className="flex items-center gap-2">
              <PriceFormatter
                amount={product.price_in_app}
                className="text-lg text-mainColor font-semibold"
              />
              {product.price && (
                <span className="text-dolphin w-[70px] truncate line-through text-sm flex-shrink-0">
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
