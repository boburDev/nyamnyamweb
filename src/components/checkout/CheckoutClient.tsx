/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { formatPrice } from "@/utils/price-format";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import PriceFormatter from "../price-format/PriceFormatter";
import { formatTimeRange } from "@/utils";
import CheckoutRight from "./CheckoutRight";
import { useTranslations } from "next-intl";

async function fetchCheckout() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Checkoutlarni olishda xatolik");
  return res.json();
}
const CheckoutClient = () => {
  const t = useTranslations("toast");
  const { data, isLoading, error } = useQuery({
    queryKey: ["checkout"],
    queryFn: fetchCheckout,
  });

  if (isLoading) return <div>{t("loading")}</div>;
  if (error || !data) return <div>{t("error-unknown")}</div>;

  return (
    <div className="grid grid-cols-12 gap-[30px]">
      <div className="col-span-7">
        <div className="bg-white shadow-md pb-5 pl-[30px] pr-5 rounded-[30px] border border-nitrogenColor">
          {data.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex justify-between py-5 border-b last:border-b-0 border-plasterColor"
            >
              <div className="flex gap-[17px]">
                <div className="rounded-[20px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={170}
                    height={130}
                    className="w-[179px] h-[139px] "
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium text-lg text-textColor mb-[14px]">
                    {item.name}
                  </p>
                  <span className="text-dolphin font-normal text-sm mb-[14px]">
                    {t("not-available")}
                  </span>
                  <span className="text-dolphin font-normal text-sm mb-4">
                    {item.restaurant}
                  </span>
                  <div className="flex gap-3 items-center">
                    <span className="text-dolphin font-normal text-base">
                      {formatPrice(item.originalPrice)}
                    </span>
                    <PriceFormatter
                      amount={item.currentPrice}
                      className="text-[22px]"
                    />
                  </div>
                </div>
              </div>
              <div>
                <span className="font-normal text-dolphin">
                  {formatTimeRange(data.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CheckoutRight data={data} />
    </div>
  );
};

export default CheckoutClient;
