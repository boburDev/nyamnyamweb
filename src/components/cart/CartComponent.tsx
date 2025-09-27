"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import { Button } from "../ui/button";
import useCartStore from "@/context/cartStore";
import { Container } from "../container";
import { ConfirmModal } from "../modal";
import { Link, useRouter } from "@/i18n/navigation";
import { ProductSkeletons, SubmitLoader } from "../loader";
import { formatPrice } from "@/utils/price-format";
import { getCart } from "@/api";
import { useDeleteCartAll, useUpdateCart, useDeleteCartItem } from "@/hooks";
import { showToast } from "../toast/Toast";

type CartUIItem = {
  id: string;
  name: string;
  image: string;
  restaurant: string;
  distance: number;
  originalPrice: number | string;
  currentPrice: number | string;
  quantity: number;
  count?: number;
  stock?: number;
  surprise_bag?: string;
};

const CartComponent = ({ isAuth }: { isAuth: boolean }) => {
  const toNumeric = (value?: number | string): number | undefined => {
    if (value == null) return undefined;
    if (typeof value === "number") return value;
    const parsed = parseFloat(String(value).replace(/[^\d.,-]/g, "").replace(",", "."));
    return Number.isNaN(parsed) ? undefined : parsed;
  };
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteCart = useCartStore((s) => s.clearCart);
  const removeItem = useCartStore((s) => s.removeFromCart); 
  const [loading, setLoading] = useState(false);
  const { updateQuantity, getTotalPrice } = useCartStore();
  const cartStore = useCartStore((s) => s.items);
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuth,
  });
  const { mutate: deleteCartAll } = useDeleteCartAll();
  const { mutate: updateCartQty } = useUpdateCart();
  const { mutate: deleteCartItem } = useDeleteCartItem(); 
  const items: CartUIItem[] | undefined = isAuth
    ? (data?.items as CartUIItem[] | undefined)
    : (cartStore as unknown as CartUIItem[]);
  const t = useTranslations("cart");

  const handleCheckout = async () => {
    if (isAuth) {
      setLoading(true);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, total: getTotalPrice() }),
        });
        const data = await res.json();
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

  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    surprise_bag?: string
  ) => {
    if (quantity < 1) return; // ❌ 1 dan pastga tushirmaymiz

    // Hozirgi itemni topamiz va serverdan kelgan count (maksimum) bo'lsa uni hisobga olamiz
    const currentItem = items?.find((i: CartUIItem) => i?.id === id);
    const serverMax = typeof currentItem?.count === "number" && currentItem?.count > 0 ? currentItem.count : 30;
    const maxAllowed = Math.min(30, serverMax);

    if (quantity > maxAllowed) {
      showToast({
        title: `Maksimal miqdor ${maxAllowed} tadan oshmasligi kerak!`,
        type: 'warning'
      });
      quantity = maxAllowed;
    }

    if (!isAuth) {
      updateQuantity(id, quantity);
    } else {
      updateCartQty({ id, quantity, surprise_bag: surprise_bag ?? "" });
    }
  };

  const handleRemoveItem = (id: string, surprise_bag?: string) => {
    if (!isAuth) {
      removeItem(id);
    } else {
      deleteCartItem({ id, surprise_bag: surprise_bag ?? "" });
    }
  };

  const openConfirm = () => setConfirmOpen(true);

  const handleConfirm = () => {
    if (!isAuth) {
      deleteCart();
    } else {
      deleteCartAll();
    }
  };

  if (items?.length === 0) {
    return (
      <div className=" bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center pt-[127px]">
            <ShoppingCart size={113} className="text-[#BCBEC3]" />
            <h2 className="text-[30px] font-semibold text-textColor mt-5">
              Savatda hozircha hech narsa yo‘q
            </h2>
            <p className="text-dolphin mt-[15px]">
              Surprise baglarni tanlab, savatingizni to‘ldiring.
            </p>
            <Link href="/">
              <Button className="font-semibold text-xl px-[25px] !h-12 mt-5">
                Surprise baglarni ko’rish
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <ProductSkeletons count={3} />;
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
                  {items?.map((item) => (
                    <div
                      key={item?.id}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-[217px] h-[147px] flex-shrink-0">
                          <Image
                            src={item?.image}
                            alt={item?.name}
                            fill
                            className="object-cover rounded-xl"
                          />
                          {item?.stock && item?.stock <= 5 && (
                            <div className="absolute top-[10px] left-[10px] backdrop-blur-[45px] text-white bg-mainColor/20 text-[13px] px-[10px] py-[3px] rounded-full font-medium">
                              {item?.stock} ta qoldi
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-textColor text-xl mb-[10px]">
                              {item?.name}
                            </h3>
                            {/* ❌ Trash delete */}
                            <Button
                              onClick={() =>
                                handleRemoveItem(item?.id, item?.surprise_bag)
                              }
                              className="w-[38px] h-[38px] rounded-full bg-hoverColor"
                              variant={"ghost"}
                            >
                              <Trash className="w-5 h-5 text-[#9A9DA5]" />
                            </Button>
                          </div>
                          <p className="text-dolphin">
                            {item?.restaurant} • {item?.distance} km
                          </p>

                          <div className="flex justify-between">
                            <div className="flex items-center gap-2 mt-[53px]">
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(toNumeric(item?.originalPrice))}
                              </span>
                              <span className="text-mainColor font-medium text-xl">
                                {formatPrice(toNumeric(item?.currentPrice))}
                              </span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-10">
                              <div className="flex items-center bg-plasterColor rounded-full p-[2px]">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item?.id,
                                      item?.quantity - 1,
                                      item?.surprise_bag
                                    )
                                  }
                                  className="p-[10px] hover:bg-gray-300 bg-white rounded-full transition-colors"
                                >
                                  <Minus className="w-4 h-4 text-textColor" />
                                </button>
                                <span className="px-4 py-2 font-medium text-textColor">
                                  {item?.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item?.id,
                                      item?.quantity + 1,
                                      item?.surprise_bag
                                    )
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

            {/* Right Section */}
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
                  {items?.map((item) => (
                    <div
                      key={item?.id}
                      className="grid grid-cols-4 border-b border-gray-200 pb-[15px]"
                    >
                      <div className="relative col-span-1 w-[100px] h-[67px] flex-shrink-0">
                        <Image
                          src={item?.image}
                          alt={item?.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col col-span-3 gap-[13px]">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-textColor text-lg truncate">
                            {item?.name}
                          </p>
                          <p className="text-dolphin font-medium text-sm flex items-end justify-end">
                            Miqdor: {item?.quantity}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-dolphin text-lg truncate max-w-[130px]">
                            {item?.restaurant}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-dolphin line-through text-xs mt-1">
                              {formatPrice(toNumeric(item?.originalPrice))}
                            </p>
                            <p className="text-textColor font-medium">
                              {formatPrice(toNumeric(item?.currentPrice))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className=" mb-[65px]">
                  <div className="flex items-center justify-between text-mainColor">
                    <span className="text-xl font-medium ">
                      Jami:
                    </span>
                    <span className="text-xl font-medium ">
                      {getTotalPrice().toLocaleString("uz-UZ")} UZS
                    </span>
                  </div>
                </div>

                <Button
                  disabled={items?.length === 0 || loading}
                  onClick={handleCheckout}
                  className="w-full h-12 text-white font-medium text-xl rounded-xl"
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
