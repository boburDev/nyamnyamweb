import { Product } from "@/api/product";
import { Star } from "lucide-react";
import Image from "next/image";
import { DataLoader } from "../loader/DataLoader";
import useCartStore from "@/context/cartStore";

interface SurpriseBagCardProps {
  product: Product;
  highlighted: boolean;
  active: boolean;
  isLoading: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

export const SurpriseBagCard = ({
  product,
  highlighted,
  active,
  isLoading,
  onHover,
  onLeave,
  onClick,
}: SurpriseBagCardProps) => {
  const { formatPrice } = useCartStore();

  if (isLoading) return <DataLoader message="Mahsulot yuklanmoqda..." />

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`
        p-[21px] border border-gray-200 rounded-lg cursor-pointer transition-all duration-300
        ${active
          ? 'border-green-500 bg-green-50 shadow-lg'
          : highlighted
            ? 'border-green-300 bg-green-50 shadow-md'
            : 'hover:shadow-md hover:border-gray-300'}
      `}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-[237px] h-[166px] flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="rounded-lg object-cover"
          />
          {/* Remaining Count Badge */}
          <div className="absolute top-[10px] left-[10px] bg-mainColor/20 text-white text-xs backdrop-blur-[45px] px-[10px] py-[3px] rounded-full font-medium">
            {product.stock || 0} ta qoldi
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-textColor text-lg ">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 ">
              <Star className="w-[16px] h-[16px] text-[#F8B133] fill-[#F8B133]" />
              <span className="text-lg font-medium text-textColor">{product.rating}</span>
            </div>
          </div>

          {/* Location */}
          <p className=" text-dolphin mt-[15px]">
            {product.restaurant} • {product.distance} km
          </p>

          {/* Pickup Time */}
          <p className="text-dolphin text-[13px] mt-5">
            Olib ketish vaqti: 9:00-23:00 oraligida
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-[36px]">
            <span className="text-[16px] text-dolphin font-medium mt-1 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-[22px] font-semibold text-mainColor">
              {formatPrice(product.currentPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
