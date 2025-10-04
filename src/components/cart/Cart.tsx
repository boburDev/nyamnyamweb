"use client"

import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import useCartStore from "@/context/cartStore";
import Image from "next/image";

export const Cart = () => {
  const {
    items,
    isOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice
  } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-[25px] w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-mainColor" />
            <h2 className="text-xl font-semibold text-textColor">
              Savat ({getTotalItems()})
            </h2>
          </div>
          <button
            onClick={toggleCart}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Savat bo'sh</p>
              <p className="text-gray-400 text-sm">Mahsulot qo'shish uchun savat tugmasini bosing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image ?? item.cover_image}
                      alt={item.name ?? item.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-textColor text-sm line-clamp-2 mb-2">
                      {item.name ?? item.title}
                    </h3>
                    <p className="text-dolphin text-xs mb-2">{item.restaurant ?? item.business_name}</p>
                    <p className="text-mainColor font-semibold text-sm">
                      {item.currentPrice ?? item.price_in_app}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3 text-red-600" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>

                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-textColor">Jami:</span>
              <span className="text-xl font-bold text-mainColor">
                {getTotalPrice().toLocaleString()} so'm
              </span>
            </div>

            <Button
              className="w-full h-12 bg-mainColor hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              Buyurtma berish
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
