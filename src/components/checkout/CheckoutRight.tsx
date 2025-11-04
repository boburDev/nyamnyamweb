/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { paymentIcons } from "@/data";
import PriceFormatter from "../price-format/PriceFormatter";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { showSuccess } from "../toast/Toast";
import { useTranslations } from "next-intl";

const CheckoutRight = ({ data }: { data: any }) => {
  const t = useTranslations("checkout");
  const tToast = useTranslations("toast");
  const handleOrder = () => {
    const products = data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      restaurant: item.restaurant,
      quantity: item.quantity,
      currentPrice: item.currentPrice,
      originalPrice: item.originalPrice,
      totalPrice: item.currentPrice * item.quantity,
      image: item.image,
    }));
    const payload = { products };
    showSuccess(`${tToast("order-ready")}: ${JSON.stringify(payload, null, 2)}`);
  };
  return (
    <div className="col-span-5">
      <div className="bg-white rounded-[30px] shadow-md px-5 pt-5 pb-[30px] border border-nitrogenColor sticky top-2">
        <h3 className="font-medium text-2xl mb-[30px] text-textColor">
          {t("payment-type")}
        </h3>
        <div className="flex flex-col gap-[18px]">
          {data?.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between">
              <div>
                <p className="text-dolphin text-lg">
                  {item.name} box x {item.quantity}
                </p>
              </div>
              <span>
                <PriceFormatter
                  amount={item.currentPrice * item.quantity}
                  className="font-medium text-textColor"
                />
              </span>
            </div>
          ))}
        </div>
        <Separator className="mt-[30px] mb-[15px] bg-plasterColor" />
        <div className="flex justify-between items-center">
          <p className="font-medium text-2xl text-mainColor">{t("All")}</p>
          <PriceFormatter amount={data.total} className="text-2xl" />
        </div>
        <Separator className="mb-5 mt-[15px] bg-plasterColor" />
        <div className="flex justify-between ">
          {paymentIcons.map(({ icon: Icon }, index) => (
            <button
              key={index}
              className="py-[6px] px-[11px] rounded-2xl border border-plasterColor inline-flex items-center justify-center flex-shrink-0 mr-1 last:mr-0 hover:border-mainColor duration-300 ease-in-out"
            >
              {Icon && <Icon />}
            </button>
          ))}
        </div>

        <Button
          onClick={handleOrder}
          className="w-full mt-[111px] h-12 font-medium text-xl"
        >
          {t("button")}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutRight;
