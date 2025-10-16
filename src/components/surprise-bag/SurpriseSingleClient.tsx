"use client";
import Image from "next/image";
import { Container } from "../container";
import { Map, StarIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/utils/price-format";
import { PriceFormatter } from "../price-format";
import AddToSingle from "../add-to-cart/AddToSingle";
import { ProductCard } from "../card";
import { useQuery } from "@tanstack/react-query";
import { useLocationStore } from "@/context/userStore";
import { getSurpriseBagSingle } from "@/api";
import { formatTimeRangeInTz } from "@/utils/time";
import { AddToFavourites } from "../add-to-cart";
import { ProductData } from "@/types";
import { DataLoader } from "../loader";
import { useEffect, useState } from "react";

export const SurpriseSingleClient = ({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) => {
  const coords = useLocationStore((s) => s.coords);
  const [client, setClient] = useState(false);
  const { data: product, isLoading } = useQuery({
    queryKey: [
      "surprise-bag",
      id,
      locale,
      coords?.lat ?? null,
      coords?.lon ?? null,
    ],
    queryFn: () => {
      console.log("Client queryFn calling getSurpriseBagSingle with:", {
        id,
        locale,
        lat: coords?.lat,
        lon: coords?.lon,
      });
      return getSurpriseBagSingle({
        id,
        locale,
        lat: coords?.lat,
        lon: coords?.lon,
      });
    },
    enabled: !!id,
  });
  useEffect(() => {
    setClient(true);
  }, []);
  if (!client) return <DataLoader />;
  const range = formatTimeRangeInTz(product?.start_time, product?.end_time);
  return (
    <div className="py-20">
      <Container>
        {isLoading ? (
          <DataLoader />
        ) : (
          <>
            <div className="bg-white p-5 rounded-[20px] flex gap-5 mb-10">
              <div className="relative w-[350px] shrink-0">
                <Image
                  src={product?.cover_image}
                  alt={product?.title}
                  width={350}
                  height={308}
                  className="w-[350px] h-[308px] rounded-[12px] object-cover"
                  priority
                />
                <span className="absolute top-5 left-5 py-2 px-[14.5px] bg-mainColor/50 rounded-[15px] backdrop-blur-[45px] font-medium text-sm text-white">
                  {product?.count} ta qoldi
                </span>
              </div>
              <div className="flex-1 ">
                <div className="flex justify-between items-center w-full mb-[27px]">
                  <h2 className="font-medium text-2xl text-textColor">
                    {product?.title}
                  </h2>
                  <AddToFavourites product={product} />
                </div>
                <div className="flex items-center justify-between mb-[23px]">
                  <p className="text-textColor text-base">
                    {product?.business_name}
                  </p>
                  {(product?.overall_rating ?? 0) > 0 && (
                    <span>
                      <StarIcon
                        size={20}
                        className="text-accordionText fill-accordionText"
                      />{" "}
                      {product?.overall_rating}
                    </span>
                  )}
                </div>
                <p className="text-dolphin font-normal text-base mb-5">
                  {product?.description}
                </p>
                <div className="flex items-start">
                  <div className="flex items-center">
                    <p className="text-dolphin text-[17px] font-normal">
                      {product?.branch_name}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-dolphin mx-[10px]"></span>
                    <span className="text-dolphin text-[17px] font-normal">
                      {product?.distance}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Link
                      href={`/surprise-bag/${product?.id}/map`}
                      className="ml-[10px] text-mainColor text-[17px] font-normal flex gap-[10px] items-center mb-5"
                    >
                      <Map className="w-5 h-5 text-mainColor" />
                      Xaritada ko’rish
                    </Link>
                  </div>
                </div>
                <div className="flex mb-5">
                  <p className="text-mainColor">Olib ketish vaqti:</p>
                  <span className="ml-1 text-textColor">{range}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <span className="line-through text-dolphin text-lg font-normal">
                      {formatPrice(product?.price)}
                    </span>
                    <PriceFormatter
                      amount={product?.price_in_app}
                      className="font-semibold text-2xl"
                    />
                    <p></p>
                  </div>
                  <AddToSingle product={product} />
                </div>
              </div>
            </div>
            {product &&
              product?.similar_data &&
              product?.similar_data?.length > 0 && (
                <div>
                  <h3 className="page-title mb-10">Boshqa super boxlar</h3>
                  <div className="grid grid-cols-3 gap-5">
                    {product?.similar_data?.map((item: ProductData) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                  </div>
                </div>
              )}
          </>
        )}
      </Container>
    </div>
  );
};

export default SurpriseSingleClient;
