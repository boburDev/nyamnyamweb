"use client"
import { getProducts } from "@/api/product"
import { ProductSkeletons } from "@/components/loader"
import PriceFormatter from "@/components/price-format/PriceFormatter"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/utils/price-format"
import { useQuery } from "@tanstack/react-query"
import { Dot, Star } from "lucide-react"
import Image from "next/image"
import { AddToCart, FavouriteButton } from "@/components/add-to-cart"

interface AllProductsComponentProps {
  selectedCategoryId?: number;
}

const AllProductsComponent = ({ selectedCategoryId }: AllProductsComponentProps) => {


  const { data: products, isLoading } = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => getProducts(selectedCategoryId),
  });

  // Remove toggle functions since AddToCart and FavouriteButton handle this internally

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3'>
      {isLoading ? (
        // Show loading skeletons
        <ProductSkeletons count={6} />
      ) : (
        // Show actual products
        products?.map((product) => (
          <div key={product.id} className="px-[5.5px] mb-[11px]">
            <div className="bg-white rounded-[25px] border border-gray-100">
              {/* Product Image */}
              <div className="relative">
                <Image
                  src={product.image ?? product.cover_image}
                  alt={product.name ?? product.title}
                  loading="lazy"
                  width={300}
                  height={200}
                  className="w-full h-[200px] object-cover rounded-t-[25px]"
                />

                {/* Stock Badge */}
                {product.stock && product.stock <= 5 && (
                  <div className="absolute top-3 left-3 bg-mainColor/20 rounded-full px-[14px] py-2 text-sm font-medium text-white backdrop-blur-[45px]">
                    {product.stock} ta qoldi
                  </div>
                )}
                {/* Bookmark Button */}
                <div className="absolute top-3 right-3">
                  <FavouriteButton product={product} size="md" />
                </div>
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
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-textColor font-medium text-lg">
                    {product.name ?? product.title}
                  </span>
                </div>

                {/* Restaurant and Distance */}
                <div className="flex items-center gap-1 mb-3 text-dolphin text-sm">
                  <span className="font-medium">{product.restaurant ?? product.business_name}</span>
                  <Dot className="w-4 h-4" />
                  <span className="font-medium">{product.distance} km</span>
                </div>

                <div className="flex gap-[10px] justify-between items-center">
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <PriceFormatter
                      amount={product.currentPrice ?? product.price_in_app}
                      className="text-lg"
                    />
                    <span className="text-dolphin line-through text-sm flex-shrink-0">
                      {formatPrice(product.originalPrice ?? product.original_price)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <AddToCart product={product} className="flex-1" />
                    <Button className="flex-1 h-10 bg-gray-100 !text-mainColor rounded-lg hover:!text-white font-medium hover:bg-gray-200 transition-colors">
                      Batafsil
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default AllProductsComponent