"use client"
import { getProducts, Product } from "@/api/product"
import { FavouriteIcon } from "@/assets/icons"
import { ProductSkeletons } from "@/components/loader"
import PriceFormatter from "@/components/price-format/PriceFormatter"
import { showToast } from "@/components/toast/Toast"
import { Button } from "@/components/ui/button"
import useCartStore from "@/context/cartStore"
import useFavouriteStore from "@/context/favouriteStore"
import { formatPrice } from "@/utils/price-format"
import { useQuery } from "@tanstack/react-query"
import { Dot, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"

interface AllProductsComponentProps {
  selectedCategoryId?: number;
}

const AllProductsComponent = ({ selectedCategoryId }: AllProductsComponentProps) => {
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { toggleFavourite, isFavourite } = useFavouriteStore();


  const { data: products, isLoading } = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => getProducts(selectedCategoryId),
  });

  const toggleBookmark = (product: Product) => {
    const isCurrentlyFavourite = isFavourite(product.id);
    toggleFavourite(product);
    showToast({
      title: isCurrentlyFavourite
        ? "Saqlangan mahsulotlardan o'chirildi"
        : "Saqlangan mahsulotlarga qo'shildi",
      type: isCurrentlyFavourite ? "info" : "success",
      href: "/favourite",
      hrefName: "Saqlangan mahsulotlar",
    });
  };

  const toggleCart = (product: Product) => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
      showToast({
        title: "Savatdan o'chirildi",
        type: "info",
        href: "/cart",
        hrefName: "Savatga o'tish",
      });
    } else {
      addToCart(product);
      showToast({
        title: "Savatga qo'shildi",
        type: "success",
        href: "/cart",
        hrefName: "Savatga o'tish",
      });
    }
  };

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
                  src={product.image}
                  alt={product.name}
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
                <button
                  onClick={() => toggleBookmark(product)}
                  className="absolute top-3 right-3 px-[9px] py-[6.5px] bg-white rounded-[15px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`${isFavourite(product.id)
                      ? "text-mainColor"
                      : "text-white"
                      }`}
                  >
                    <FavouriteIcon className="w-[24px] h-[24px]" />
                  </span>
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
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-textColor font-medium text-lg">
                    {product.name}
                  </span>
                </div>

                {/* Restaurant and Distance */}
                <div className="flex items-center gap-1 mb-3 text-dolphin text-sm">
                  <span className="font-medium">{product.restaurant}</span>
                  <Dot className="w-4 h-4" />
                  <span className="font-medium">{product.distance} km</span>
                </div>

                <div className="flex gap-[10px] justify-between items-center">
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <PriceFormatter
                      amount={product.currentPrice}
                      className="text-lg"
                    />
                    <span className="text-dolphin line-through text-sm flex-shrink-0">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleCart(product)}
                      className={`flex-1 h-10 rounded-lg flex items-center justify-center transition-colors hover:!text-white ${isInCart(product.id) || product.isInCart
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
      )}
    </div>
  )
}

export default AllProductsComponent