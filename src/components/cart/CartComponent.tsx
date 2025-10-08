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
import { Product } from "@/api/product";
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

type ItemLike = CartUIItem | (Product & { quantity: number });

const getItemImage = (item: ItemLike): string => {
  const img = ("image" in item ? item.image : undefined) || ("cover_image" in item ? item.cover_image : undefined);
  return img && String(img).trim() !== "" ? String(img) : "/productimg.png";
};

const getItemTitle = (item: ItemLike): string => {
  return ("name" in item && item.name) ? item.name : ("title" in item ? item.title ?? "" : "");
};

const getItemRestaurant = (item: ItemLike): string => {
  if ("restaurant" in item && item.restaurant) return item.restaurant;
  if ("business_name" in item && item.business_name) return item.business_name;
  return "";
};

const getItemOriginalPrice = (item: ItemLike): number | undefined => {
  const val = ("originalPrice" in item ? item.originalPrice : undefined) ?? ("original_price" in item ? item.original_price : undefined);
  if (val == null) return undefined;
  if (typeof val === "number") return val;
  const parsed = parseFloat(String(val).replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isNaN(parsed) ? undefined : parsed;
};

const getItemCurrentPrice = (item: ItemLike): number => {
  const raw = ("currentPrice" in item ? item.currentPrice : undefined) ?? ("price_in_app" in item ? item.price_in_app : undefined);
  if (typeof raw === "number") return raw;
  const parsed = parseFloat(String(raw ?? 0).replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const CartComponent = ({ isAuth }: { isAuth: boolean }) => {
  // removed old toNumeric; using typed helpers below
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
  const items: ItemLike[] | undefined = isAuth
    ? ((data?.items as ItemLike[] | undefined))
    : ((cartStore as unknown as ItemLike[]));
  const t = useTranslations("cart");

  const getDisplayTotal = () => {
    if (!items) return 0;
    try {
      return items.reduce((sum, it: ItemLike) => {
        const price = getItemCurrentPrice(it);
        const qty = typeof it.quantity === "number" ? it.quantity : 1;
        return sum + price * qty;
      }, 0);
    } catch {
      return 0;
    }
  };

  const handleCheckout = async () => {
    if (isAuth) {
      setLoading(true);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, total: getDisplayTotal() }),
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

  console.log("Cart items:", items);
  
  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    surprise_bag?: string
  ) => {
    if (quantity < 1) return;

    const currentItem = items?.find((i: ItemLike) => i && "id" in i && i.id === id);
    const getServerMax = (it?: ItemLike): number => {
      if (!it) return 30;
      if ("count" in it && typeof it.count === "number" && it.count > 0) return it.count;
      if ("stock" in it && typeof it.stock === "number" && it.stock > 0) return it.stock;
      return 30;
    };
    const serverMax = getServerMax(currentItem);
    const maxAllowed = Math.min(30, serverMax);

    if (quantity > maxAllowed) {
      showToast({
        title: `Maksimal miqdor ${maxAllowed} tadan oshmasligi kerak!`,
        type: "warning",
      });
      quantity = maxAllowed;
    }

    if (!isAuth) {
      updateQuantity(id, quantity);
    } else {
      const sb = (() => {
        if (typeof surprise_bag === "string") return surprise_bag;
        if (currentItem && "surprise_bag" in currentItem) return (currentItem as CartUIItem).surprise_bag ?? "";
        return "";
      })();
      updateCartQty({ id, quantity, surprise_bag: sb });
    }
  };

  const handleRemoveItem = (id: string) => {
    if (!isAuth) {
      removeItem(id);
    } else {
      deleteCartItem({ id });
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
                            src={getItemImage(item)}
                            alt={getItemTitle(item) || "Mahsulot rasmi"}
                            fill
                            className="object-cover rounded-xl"
                          />

                          {/* {item?.stock && item?.stock <= 5 && (
                            <div className="absolute top-[10px] left-[10px] backdrop-blur-[45px] text-white bg-mainColor/20 text-[13px] px-[10px] py-[3px] rounded-full font-medium">
                              {item?.stock} ta qoldi
                            </div>
                          )} */}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-textColor text-xl mb-[10px]">
                              {getItemTitle(item)}
                            </h3>
                            {/* ❌ Trash delete */}
                            <Button
                              onClick={() =>
                                handleRemoveItem(item?.id,)
                              }
                              className="w-[38px] h-[38px] rounded-full bg-hoverColor"
                              variant={"ghost"}
                            >
                              <Trash className="w-5 h-5 text-[#9A9DA5]" />
                            </Button>
                          </div>
                          <p className="text-dolphin">
                            {getItemRestaurant(item)} • {"distance" in item && typeof item.distance === 'number' ? item.distance : ''} km
                          </p>

                          <div className="flex justify-between">
                            <div className="flex items-center gap-2 mt-[53px]">
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(getItemOriginalPrice(item))}
                              </span>
                              <span className="text-mainColor font-medium text-xl">
                                {formatPrice(getItemCurrentPrice(item))}
                              </span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mt-10">
                              <div className="flex items-center bg-plasterColor rounded-full p-[2px] pr-[2.5px] py-[1px]">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item?.id,
                                      item?.quantity - 1,
                                      "surprise_bag" in item ? (item as CartUIItem).surprise_bag : undefined
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
                                      "surprise_bag" in item ? (item as CartUIItem).surprise_bag : undefined
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
                          src={getItemImage(item)}
                          alt={getItemTitle(item)}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col col-span-3 gap-[13px]">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-textColor text-lg truncate">
                            {getItemTitle(item)}
                          </p>
                          <p className="text-dolphin font-medium text-sm flex items-end justify-end">
                            Miqdor: {item?.quantity}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-dolphin text-lg truncate max-w-[130px]">
                            {getItemRestaurant(item)}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-dolphin line-through text-xs mt-1">
                              {formatPrice(getItemOriginalPrice(item))}
                            </p>
                            <p className="text-textColor font-medium">
                              {formatPrice(getItemCurrentPrice(item))}
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
                    <span className="text-xl font-medium ">Jami:</span>
                    <span className="text-xl font-medium ">
                      {(isAuth ? getDisplayTotal() : getTotalPrice()).toLocaleString("uz-UZ")} UZS
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
