
"use client"

import React from 'react'
import Image from 'next/image'
import { Star, Bookmark, ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button'
import useFavouriteStore from '@/context/favouriteStore'
import useCartStore from '@/context/cartStore'
import { showToast } from '../toast/Toast'
import { Product } from '@/api/product'

const FavouriteCart = () => {
  const { items, removeFromFavourites } = useFavouriteStore()
  const { addToCart, removeFromCart, isInCart, formatPrice } = useCartStore()

  const toggleCart = (item: Product) => {
    if (isInCart(item.id)) {
      removeFromCart(item.id);
      showToast({ title: "Savatdan o'chirildi", type: "info", href: "/cart", hrefName: "Savatga o'tish" });
    } else {
      addToCart(item);
      showToast({ title: "Savatga qo'shildi", type: "success", href: "/cart", hrefName: "Savatga o'tish" });
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-textColor mb-2">Saqlangan mahsulotlar yo'q</h2>
        <p className="text-dolphin">Mahsulotlarni saqlash uchun bookmark tugmasini bosing</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-[217px] h-[147px] flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-xl"
              />
              {/* Bookmark Icon */}

            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-[14px]">
                <h3 className="font-medium text-textColor text-xl ">
                  {item.name}
                </h3>
                <button
                  onClick={() => removeFromFavourites(item.id)}
                  className="p-1 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bookmark className="w-6 h-6 text-mainColor fill-mainColor" />
                </button>
              </div>

              {/* Restaurant and Distance */}
              <div className="flex items-center justify-between mb-[43px]">
                <p className="text-dolphin">
                  {item.restaurant} • {item.distance} km
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 ">
                  <Star className="w-4 h-4 text-[#F8B133] fill-[#F8B133]" />
                  <span className="text-textColor font-medium">{item.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* Pricing */}
                <div className="flex items-center gap-2 pt-3">
                  <span className="text-mainColor font-semibold text-lg">
                    {formatPrice(item.currentPrice)}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    {formatPrice(item.originalPrice)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => toggleCart(item)}
                    className={`p-2 rounded-lg transition-colors ${isInCart(item.id)
                      ? "bg-mainColor text-white hover:bg-mainColor/90"
                      : "bg-plasterColor hover:bg-gray-200 !text-mainColor hover:!text-white"
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                  <Button className="bg-plasterColor hover:bg-gray-200 !text-mainColor hover:!text-white px-4 py-2 rounded-lg transition-colors">
                    Batafsil
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FavouriteCart