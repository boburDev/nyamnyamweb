"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import useCartStore from "@/context/cartStore";
import { Container } from "../container";
import { ConfirmModal } from "../modal";
import { Link, useRouter } from "@/i18n/navigation";
import { SubmitLoader } from "../loader";
import { formatPrice } from "@/utils/price-format";

const CartComponent = ({ isAuth }: { isAuth: boolean }) => {
  const t = useTranslations("cart");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);
  const { items, updateQuantity, getTotalPrice } = useCartStore();
  const router = useRouter();
  const handleCheckout = async () => {
    if (isAuth) {
      setLoading(true);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
            total: getTotalPrice(),
          }),
        });
        const data = await res.json();
        console.log("Checkout response:", data);

        if (data.success) {
          router.push("/checkout");
          deleteCart();
        }
      } catch (error) {
        console.error("Checkout error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      router.push("/signin");
    }
  };

  const openConfirm = () => {
    setConfirmOpen(true);
  };
  const handleConfirm = () => {
    deleteCart();
  };
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-[127px]">
              <ShoppingCart size={113} className="text-[#BCBEC3]" />
            <h2 className="text-[30px] font-semibold text-textColor mt-5">
              Savatda hozircha hech narsa yo‘q
            </h2>
            <p className="text-dolphin mt-[15px]">
              Surprise baglarni tanlab, savatingizni to‘ldiring.
            </p>
            <Link href="/">
              <Button className="font-semibold text-xl px-[25px] py-[9px] mt-5">
                Surprise baglarni ko’rish
              </Button>
            </Link>

          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Container className="mb-[150px] mt-[76px]">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Section - Cart Items */}
            <div className="lg:col-span-3">
              <div className="">
                <div className="flex items-center justify-between mb-10">
                  <h1 className="text-4xl font-medium text-textColor">Savat</h1>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-[217px] h-[147px] flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-xl"
                          />
                          {/* Stock Badge */}
                          {item.stock && item.stock <= 5 && (
                            <div className="absolute top-[10px] left-[10px] backdrop-blur-[45px] text-white bg-mainColor/20 text-[13px] px-[10px] py-[3px] rounded-full font-medium">
                              {item.stock} ta qoldi
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-textColor text-xl mb-[10px]">
                            {item.name}
                          </h3>
                          <p className="text-dolphin">
                            {item.restaurant} • {item.distance} km
                          </p>

                          {/* Pricing */}
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2 mt-[53px]">
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(item.originalPrice)}
                              </span>
                              <span className="text-mainColor font-medium text-xl">
                                {formatPrice(item.currentPrice)}
                              </span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-10">
                              <div className="flex items-center bg-plasterColor rounded-full p-[2px]">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="p-[10px] hover:bg-gray-300 bg-white rounded-full transition-colors"
                                >
                                  <Minus className="w-4 h-4 text-textColor" />
                                </button>
                                <span className="px-4 py-2 font-medium text-textColor">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="p-[10px] hover:bg-gray-300 bg-white rounded-full transition-colors"
                                >
                                  <Plus className="w-4 h-4 text-textColor" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section - Payment Summary */}
            <div className="lg:col-span-2 mt-20">
              <div className="bg-white rounded-2xl shadow-sm px-5 py-[15px] sticky top-4">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[26px] font-medium text-textColor">
                    To'lov tafsiloti
                  </h2>
                  <button
                    onClick={openConfirm}
                    className="text-dolphin text-lg font-medium transition-colors"
                  >
                    O'chirish
                  </button>
                </div>

                {/* Items Summary */}
                <div className="flex flex-col gap-[15px] mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-4 border-b border-gray-200 pb-[15px]"
                    >
                      <div className="relative col-span-1 w-[100px] h-[67px] flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col col-span-3 gap-[13px]">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-textColor text-lg truncate">
                            {item.name}
                          </p>
                          <p className="text-dolphin font-medium text-sm flex items-end justify-end">
                            Miqdor: {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-dolphin text-lg truncate  max-w-[130px]">
                            {item.restaurant}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-dolphin line-through text-xs mt-1">
                              {formatPrice(item.originalPrice)}
                            </p>
                            <p className="text-textColor font-medium">
                              {formatPrice(item.currentPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className=" mb-[65px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium text-textColor">
                      Jami:
                    </span>
                    <span className="text-xl font-medium text-textColor">
                      {getTotalPrice().toLocaleString("uz-UZ")} UZS
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  disabled={items.length === 0 || loading}
                  onClick={handleCheckout}
                  className="w-full h-12  text-white font-medium text-xl rounded-xl "
                >
                  {loading ? <SubmitLoader /> : "To'lovga o'tish"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <ConfirmModal
        open={confirmOpen}
        message={t("deleteAll")}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default CartComponent;
