"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Minus, Plus, StarIcon, TrashIcon } from "lucide-react";
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
                    <div className="flex items-center justify-between mb-10">
                      <h1 className="text-4xl font-medium text-textColor">
                        Savat
                      </h1>
                    </div>

                    <div className="space-y-4">
                      {items?.map((item: ProductData) => (
                        <div
                          key={item?.id}
                          className="bg-white border border-gray-100 rounded-2xl p-2.5 2xl:p-5 shadow-sm"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="relative w-[152px] h-[156px] 2xl:w-[217px] 2xl:h-[147px] flex-shrink-0">
                              <Image
                                src={item?.cover_image}
                                alt={item?.title}
                                fill
                                className="object-cover rounded-[12px] xl:roundeed-xl"
                              />

                              {item?.count && item?.count >= 5 && (
                                <div className="absolute top-[10px] left-[10px] backdrop-blur-[3px] text-white bg-mainColor/30 text-[13px] px-[10px] py-[3px] rounded-full font-medium">
                                  {item?.count} ta qoldi
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-textColor text-lg 2xl:text-xl mb-[10px]">
                                  {item?.title}
                                </h3>
                                <Button
                                  onClick={() => handleDelete(item?.id)}
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
                                  {item?.branch_name} • {item?.distance}
                                </p>
                              </div>

                              <div className="flex justify-between">
                                <div className="flex items-center gap-2 mt-[53px]">
                                  <span className="text-gray-400 line-through text-sm">
                                    {formatPrice(item?.price)}
                                  </span>
                                  <span className="text-mainColor font-medium text-xl">
                                    {formatPrice(item?.price_in_app)}
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
                                            ? item?.surprise_bag
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
                                            ? item?.surprise_bag
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
                        onClick={toggleConfirm}
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
                              {item?.title} box x {item?.quantity}
                            </p>
                          </div>
                          <span>
                            <PriceFormatter
                              amount={item?.price_in_app * item?.quantity}
                              className="font-medium text-textColor"
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="mt-[30px] mb-[15px] bg-plasterColor" />
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-2xl text-mainColor">
                        Jami:
                      </p>
                      <PriceFormatter
                        amount={totalPrice}
                        className="text-2xl"
                      />
                    </div>
                    <Separator className="mb-5 mt-[15px] bg-plasterColor" />
                    <div>
                      <div className="flex xl:justify-between gap-1 flex-wrap">
                        {paymentIcons.map(({ icon: Icon, name }, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setPayment(name);
                              setError("");
                            }}
                            className={`py-[6px] px-[11px] rounded-2xl border inline-flex items-center justify-center flex-shrink-0 hover:border-mainColor duration-300 ease-in-out ${payment === name
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
                      disabled={items?.length === 0 || isPending}
                      onClick={handleCheckout}
                      className="w-full h-12 text-white font-medium text-xl rounded-xl mt-20"
                    >
                      {isPending ? <SubmitLoader /> : "To'lovga o'tish"}
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
