"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, StarIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import useCartStore from "@/context/cartStore";
import { Container } from "../container";
import { ConfirmModal } from "../modal";
import { Link, useRouter } from "@/i18n/navigation";
import { ProductSkeletons, SubmitLoader } from "../loader";
import { formatPrice } from "@/utils/price-format";
import { getCart } from "@/api";
import {
  useDeleteCartAll,
  useUpdateCart,
  useDeleteCartItem,
  useCreateOrder,
} from "@/hooks";
import { showToast } from "../toast/Toast";
import { OrderPayload, ProductData } from "@/types";
import { Separator } from "../ui/separator";
import { PriceFormatter } from "../price-format";
import { paymentIcons } from "@/data";

const CartComponent = ({ isAuth }: { isAuth: boolean }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteCart = useCartStore((s) => s.clearCart);
  const [error, setError] = useState<string | null>(null);
  const removeItem = useCartStore((s) => s.removeFromCart);
  const locale = useLocale();
  const { updateQuantity, getTotalPrice } = useCartStore();
  const cartStore = useCartStore((s) => s.items);
  const [payment, setPayment] = useState<string | null>(null);
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuth,
  });
  const { mutate: deleteCartAll } = useDeleteCartAll();
  const { mutate: updateCartQty } = useUpdateCart();
  const { mutate: deleteCartItem } = useDeleteCartItem();
  const { mutate: createOrder, isPending: loading } = useCreateOrder();

  const cartData = data ?? { cart_items: [], cart_total: 0 };
  const items = isAuth ? cartData?.cart_items ?? [] : cartStore;
  const t = useTranslations("cart");
  const totalPrice = isAuth ? cartData?.cart_total : getTotalPrice();
  const handleCheckout = () => {
    if (!isAuth) {
      router.push("/signin");
      return;
    }
    if (!payment) {
      setError("To'lov turi tanlang");
      return;
    }
    const payload: OrderPayload = {
      order_items: items.map((item: ProductData) => ({
        title: item.title,
        count: item.quantity,
        price: item.price_in_app,
        surprise_bag: item.id,
        start_time: item.start_time || "",
        end_time: item.end_time || "",
        weekday: item.weekday ?? 0,
      })),
      total_price: totalPrice,
      payment_method: payment || "",
    };

    createOrder(
      { data: payload, locale },
      {
        onSuccess: () => {
          router.push("/order");
        },
      }
    );
  };

  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    surprise_bag?: string
  ) => {
    if (quantity < 1) return;

    const currentItem = items?.find(
      (i: ProductData) => i && "id" in i && i.id === id
    );
    const getServerMax = (it: ProductData): number => {
      if (!it) return 30;
      if ("count" in it && typeof it.count === "number" && it.count > 0)
        return it.count;
      if ("stock" in it && typeof it.stock === "number" && it.stock > 0)
        return it.stock;
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
        if (currentItem && "surprise_bag" in currentItem)
          return currentItem.surprise_bag ?? "";
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Section - Cart Items */}
            <div className="lg:col-span-7">
              <div className="">
                <div className="flex items-center justify-between mb-10">
                  <h1 className="text-4xl font-medium text-textColor">Savat</h1>
                </div>

                <div className="space-y-4">
                  {items?.map((item: ProductData) => (
                    <div
                      key={item?.id}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-[217px] h-[147px] flex-shrink-0">
                          <Image
                            src={item.surprise_bag_image}
                            alt={item?.title}
                            fill
                            className="object-cover rounded-xl"
                          />

                          {item?.count && item?.count <= 5 && (
                            <div className="absolute top-[10px] left-[10px] backdrop-blur-[45px] text-white bg-mainColor/20 text-[13px] px-[10px] py-[3px] rounded-full font-medium">
                              {item?.count} ta qoldi
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-textColor text-xl mb-[10px]">
                              {item?.title}
                            </h3>
                            <Button
                              onClick={() => handleRemoveItem(item?.id)}
                              className="w-[38px] h-[38px] rounded-full bg-hoverColor text-[#9A9DA5] hover:text-dangerColor"
                              variant={"ghost"}
                            >
                              <TrashIcon className="w-5 h-5 " />
                            </Button>
                          </div>
                          <div className="flex gap-2 items-center">
                            {!items?.overall_rating && (
                              <div className="flex gap-1 items-center">
                                <span>
                                  <StarIcon
                                    size={20}
                                    className="text-accordionText fill-accordionText"
                                  />
                                </span>
                                <span className="font-medium text-lg text-textColor">
                                  {items?.overall_rating} 5.0
                                </span>
                              </div>
                            )}
                            <p className="text-dolphin">
                              {item.branch_name} • {item?.distance}
                            </p>
                          </div>

                          <div className="flex justify-between">
                            <div className="flex items-center gap-2 mt-[53px]">
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(item.price)}
                              </span>
                              <span className="text-mainColor font-medium text-xl">
                                {formatPrice(item.price_in_app)}
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
                                      "surprise_bag" in item
                                        ? item.surprise_bag
                                        : undefined
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
                                      "surprise_bag" in item
                                        ? item.surprise_bag
                                        : undefined
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
            <div className="lg:col-span-5 mt-20">
              <div className="bg-white rounded-2xl shadow-sm px-5 py-[15px] sticky top-4 ">
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

                <div className="flex flex-col gap-[18px]">
                  {items?.map((item: ProductData, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <p className="text-dolphin text-lg">
                          {item.title} box x {item.quantity}
                        </p>
                      </div>
                      <span>
                        <PriceFormatter
                          amount={item.price_in_app * item.quantity}
                          className="font-medium text-textColor"
                        />
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="mt-[30px] mb-[15px] bg-plasterColor" />
                <div className="flex justify-between items-center">
                  <p className="font-medium text-2xl text-mainColor">Jami:</p>
                  <PriceFormatter amount={totalPrice} className="text-2xl" />
                </div>
                <Separator className="mb-5 mt-[15px] bg-plasterColor" />
                <div>
                  <div className="flex justify-between ">
                    {paymentIcons.map(({ icon: Icon, name }, index) => (
                      <button
                        key={index}
                        onClick={() => setPayment(name)}
                        className={`py-[6px] px-[11px] rounded-2xl border  inline-flex items-center justify-center flex-shrink-0 mr-1 last:mr-0 hover:border-mainColor duration-300 ease-in-out ${
                          payment === name
                            ? "border-mainColor"
                            : "border-plasterColor"
                        }`}
                      >
                        {Icon && <Icon />}
                      </button>
                    ))}
                  </div>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                <Button
                  disabled={items?.length === 0 || loading}
                  onClick={handleCheckout}
                  className="w-full h-12 text-white font-medium text-xl rounded-xl mt-20"
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
