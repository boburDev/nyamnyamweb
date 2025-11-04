"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, Minus, Plus, StarIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Container } from "../container";
import { ConfirmModal } from "../modal";
import { ProductSkeletons, SubmitLoader } from "../loader";
import { formatPrice } from "@/utils/price-format";
import { useHelpCart } from "@/hooks";
import { ProductData } from "@/types";
import { Separator } from "../ui/separator";
import { PriceFormatter } from "../price-format";
import { paymentIcons } from "@/data";
import EmptyCart from "./EmptyCart";
import { useEffect, useState } from "react";

const CartComponent = ({ isAuth }: { isAuth: boolean }) => {
  const t = useTranslations("cart");
  // cart-helper
  const {
    items,
    toggleConfirm,
    totalPrice,
    handleConfirm,
    isLoading,
    confirmOpen,
    handleDelete,
    error,
    setPayment,
    payment,
    handleUpdateQuantity,
    handleCheckout,
    isPending,
    setError,
  } = useHelpCart({ auth: isAuth });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Boshlang'ich holatni aniqlaymiz
    setIsDesktop(window.innerWidth >= 768);

    // Resize bo'lganda qayta tekshiramiz
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      <Container>
        {isLoading || items === undefined ? (
          <div className="grid sm:grid-cols-12 gap-3 xl:gap-8 mt-10">
            <div className="sm:col-span-7 flex flex-col gap-y-5">
              <ProductSkeletons count={3} />
            </div>
            <div className="sm:col-span-5 rounded-2xl skeleton-puls h-110">
            </div>
          </div>
        ) : items?.length > 0 ? (
          <>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xl:gap-8">
                {/* Left Section - Cart Items */}
                <div className="lg:col-span-7">
                  <div>
                    <div className="hidden md:flex items-center justify-between mb-10">
                      <h1 className="text-4xl font-medium text-textColor">
                        {t("title")}
                      </h1>
                    </div>

                    <div className="space-y-4">
                      {items?.map((item: ProductData) => (
                        <div
                          key={item?.id}
                          className="bg-white border border-gray-100 rounded-[12px] md:rounded-2xl md:p-[15px] 2xl:p-5 shadow-sm"
                        >
                          <div className="flex gap-2.5 md:gap-4">
                            {/* Product Image */}
                            <div className="relative w-30 md:w-[152px] md:h-[139px] 2xl:w-[217px] 2xl:h-[147px] flex-shrink-0">
                              <Image
                                src={item?.cover_image}
                                alt={item?.title}
                                fill
                                className="object-cover rounded-s-[12px] md:rounded-[12px] xl:roundeed-xl"
                              />

                              {item?.count && item?.count <= 5 && (
                                <div className="absolute top-2 left-2 md:top-2.5 md:left-2.5 backdrop-blur-[3px] text-white bg-mainColor/30 text-[10px] md:text-[13px] px-2.5 py-[3px] rounded-full font-medium">
                                  {item?.count} {t("card-count")}
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 flex flex-col 2xl:block p-2.5 pl-0 md:p-0">
                              <div className="flex md:items-center justify-between">
                                <h3 className="font-semibold md:font-medium text-textColor md:text-lg 2xl:text-xl 2xl:mb-[10px]">
                                  {item?.title}
                                </h3>
                                <Button
                                  onClick={() => handleDelete(item?.id)}
                                  className="w-[38px] h-[38px] rounded-full bg-hoverColor text-iron/70 hover:text-dangerColor [&_svg:not([class*='size-'])]:size-5"
                                  variant={"ghost"}
                                >
                                  <TrashIcon />
                                </Button>
                              </div>
                              <div className="flex gap-[5px] xl:gap-2 items-center mt-4 md:mt-5 xl:mt-0">
                                {!items?.overall_rating && (
                                  <div className="flex gap-1">
                                    <span>
                                      <StarIcon
                                        className="size-3.5 xl:size-5 mt-[1.5px] text-accordionText fill-accordionText"
                                      />
                                    </span>
                                    <span className="font-medium text-[13px] 2xl:text-lg text-textColor">
                                      {items?.overall_rating} 5.0
                                    </span>
                                  </div>
                                )}
                                <p className="text-dolphin text-xs md:text-sm xl:text-base">
                                  {item?.branch_name} • {item?.distance}
                                </p>
                              </div>

                              <div className="flex justify-between mt-4 md:mt-auto">
                                <div className="flex items-center gap-2 2xl:mt-[53px]">
                                  <span className="text-mainColor font-medium md:text-xl">
                                    {formatPrice(item?.price_in_app)}
                                  </span>
                                  <span className="text-gray-400 line-through text-sm mt-0.5 hidden md:block">
                                    {formatPrice(item?.price)}
                                  </span>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center 2xl:mt-10">
                                  <div className="flex items-center bg-plasterColor rounded-full p-[2px] pr-[2.5px] py-[1px]">
                                    <button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item?.id,
                                          item?.quantity - 1,
                                          "surprise_bag" in item
                                            ? item?.surprise_bag
                                            : undefined
                                        )
                                      }
                                      className="p-2 xl:p-2.5 hover:bg-gray-300 bg-white rounded-full transition-colors"
                                    >
                                      <Minus className="w-4 h-4 text-textColor" />
                                    </button>
                                    <span className="px-3 xl:px-4 py-1.5 xl:py-2 font-medium text-textColor">
                                      {item?.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item?.id,
                                          item?.quantity + 1,
                                          "surprise_bag" in item
                                            ? item?.surprise_bag
                                            : undefined
                                        )
                                      }
                                      className="p-2 xl:p-2.5 hover:bg-gray-300 bg-white rounded-full transition-colors"
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

                {/* Right Section desctop */}
                <div className="hidden md:block lg:col-span-5 mt-20">
                  <div className="bg-white rounded-[20px] xl:rounded-2xl shadow-sm p-[18px] xl:px-5 xl:py-[15px] sticky top-4 ">
                    <div className="flex items-center justify-between mb-[15px] 2xl:mb-5">
                      <h2 className="text-[20px] 2xl:text-[26px] font-medium text-textColor">
                        {t("Payment-details.title")}
                      </h2>
                      <button
                        onClick={toggleConfirm}
                        className="text-dolphin 2xl:text-lg font-medium transition-colors"
                      >
                        {t("Payment-details.delete")}
                      </button>
                    </div>

                    <div className="flex flex-col gap-[15px] xl:gap-[18px]">
                      {items?.map((item: ProductData, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <div>
                            <p className="text-dolphin text-sm xl:text-lg">
                              {item?.title} box x {item?.quantity}
                            </p>
                          </div>
                          <span>
                            <PriceFormatter
                              amount={item?.price_in_app * item?.quantity}
                              className="font-medium text-textColor text-sm xl:text-lg"
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="hidden xl:block mt-[30px] mb-[15px] bg-plasterColor" />
                    <div className="flex justify-between items-center mt-1 xl:mt-0">
                      <p className="font-medium 2xl:text-2xl text-mainColor">
                        {t("Payment-details.total")}
                      </p>
                      <PriceFormatter
                        amount={totalPrice}
                        className="text-base 2xl:text-2xl"
                      />
                    </div>
                    <Separator className="mb-[15px] 2xl:mb-5 mt-[15px] bg-plasterColor" />
                    <div className="relative">
                      <div className="flex xl:justify-between gap-x-1 gap-y-2 flex-wrap">
                        {isDesktop && (paymentIcons.map(({ icon: Icon, name }, index) => (
                          <button
                            key={index + 10}
                            onClick={() => {
                              setPayment(name);
                              setError("");
                            }}
                            className={`h-8 px-2 rounded-2xl border inline-flex items-center justify-center flex-shrink-0 hover:border-mainColor duration-300 ease-in-out [&_svg]:h-[15px] ${payment === name
                              ? "border-mainColor"
                              : "border-plasterColor"
                              }`}
                          >
                            {Icon && <Icon />}
                          </button>
                        )))}
                      </div>
                      {error && <p className="text-red-500 mt-2 xl:absolute">{error}</p>}
                    </div>

                    <Button
                      disabled={items?.length === 0 || isPending}
                      onClick={handleCheckout}
                      className="w-full xl:h-12 text-white font-medium xl:text-xl rounded-[12px] xl:rounded-xl mt-5 xl:mt-20"
                    >
                      {isPending ? <SubmitLoader /> : t("Payment-details.button")}
                    </Button>
                  </div>
                </div>
                {/* Right Section mobile */}
                <div className="md:hidden mt-7.5 pb-17">
                  <div className="relative">
                    <p className="font-medium mb-3">{t("Payment-details.payment-type")}</p>
                    <div className="flex xl:justify-between gap-2 flex-wrap">
                      {!isDesktop && (paymentIcons.map(({ icon: Icon, name }, index) => (
                        <button
                          key={index + 20}
                          onClick={() => {
                            setPayment(name);
                            setError("");
                          }}
                          className={`h-[54px] max-w-[95px] px-3 rounded-2xl border-2 inline-flex items-center justify-center flex-shrink-0 hover:border-mainColor duration-300 ease-in-out [&_svg]:h-6 bg-white relative ${payment === name
                            ? "border-mainColor"
                            : "border-white"
                            }`}
                        >
                          {payment === name && <span className="absolute -top-[7px] -right-[7px] size-5 flex items-center justify-center rounded-full bg-mainColor"><Check size={13} color="#fff" /></span>}
                          {Icon && <Icon />}
                        </button>
                      )))}
                    </div>
                    {error && <p className="text-red-500 mt-2 xl:absolute">{error}</p>}
                  </div>
                  <div className="fixed bottom-0 z-99 left-0 w-full rounded-t-[20px] bg-white p-4">
                    <div className="flex justify-between items-center mt-1 xl:mt-0">
                      <p className="font-semibold text-lg">
                        {t("Payment-details.total")}
                      </p>
                      <PriceFormatter
                        amount={totalPrice}
                        className="font-semibold text-lg text-textColor"
                      />
                    </div>
                    <Button
                      disabled={items?.length === 0 || isPending}
                      onClick={handleCheckout}
                      className="w-full h-12 text-white font-medium xl:text-xl rounded-[20px] mt-2.5"
                    >
                      {isPending ? <SubmitLoader /> : t("Payment-details.button")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <ConfirmModal
              open={confirmOpen}
              message={t("deleteAll")}
              onConfirm={handleConfirm}
              onCancel={toggleConfirm}
            />
          </>
        ) : (
          <EmptyCart />
        )}
      </Container>
    </div>
  );
};

export default CartComponent;
