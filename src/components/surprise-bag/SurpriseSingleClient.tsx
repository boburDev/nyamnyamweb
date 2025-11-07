"use client";
import Image from "next/image";
import { Container } from "../container";
import { ArrowLeft, Clock, Map, MapPin, StarIcon } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { formatPrice } from "@/utils/price-format";
import { PriceFormatter } from "../price-format";
import { ProductCard } from "../card";
import { useQuery } from "@tanstack/react-query";
import { useLocationStore } from "@/context/userStore";
import { getSurpriseBagSingle } from "@/api";
import { formatTimeRangeInTz } from "@/utils/time";
import { AddToCart, AddToFavourites } from "../add-to-cart";
import { ProductData } from "@/types";
import { DataLoader } from "../loader";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export const SurpriseSingleClient = ({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) => {
  const router = useRouter();
  const t = useTranslations("cards-detail");
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
    <div className="sm:py-10 xl:py-20">
      <Container>
        {isLoading ? (
          <DataLoader />
        ) : (
          <>
            <div className="sm:bg-white sm:p-5 rounded-[20px] flex flex-col sm:flex-row sm:gap-5 sm:mb-10">
              <div className="relative -right-[16px] -left-[16px] w-screen -top-[28px] sm:w-auto sm:relative sm:right-0 sm:left-0 sm:top-0">
                <Image
                  src={product?.cover_image}
                  alt={product?.title}
                  width={250}
                  height={250}
                  className="w-full sm:size-[250px] xl:w-[350px] xl:h-[308px] sm:rounded-[12px] object-cover "
                  priority
                />
                <span className="absolute bottom-0 right-0 sm:top-5 sm:left-5 size-fit py-2 px-[14.5px] bg-white sm:bg-mainColor/50 rounded-tl-[15px] sm:rounded-[15px]! backdrop-blur-[45px] font-medium text-sm sm:text-white">
                  {product?.count} {t("count")}
                </span>
              </div>
              {/* Desktop desc */}
              <div className="flex-1 hidden sm:block">
                <div className="flex justify-between items-center w-full mb-3 xl:mb-[27px]">
                  <h2 className="font-semibold sm:font-medium text-[22px] md:text-xl xl:text-2xl text-textColor">
                    {product?.title}
                  </h2>
                  <AddToFavourites product={product} className="absolute top-4 right-4 sm:relative" />
                </div>
                <div className="flex items-center justify-between mb-3 xl:mb-[23px]">
                  <p className="text-textColor md:text-sm xl:text-base">
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
                <p className="text-dolphin font-normal text-sm xl:text-base mb-3 xl:mb-5">
                  {product?.description}
                </p>
                <div className="flex items-start">
                  <div className="flex items-center">
                    <p className="text-dolphin text-sm xl:text-[17px] font-normal">
                      {product?.branch_name}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-dolphin mx-[10px]"></span>
                    <span className="text-dolphin text-sm xl:text-[17px] font-normal">
                      {product?.distance}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Link
                      href={`/surprise-bag/${product?.id}/map`}
                      className="ml-[10px] text-mainColor text-sm xl:text-[17px] flex gap-[10px] items-center mb-3 xl:mb-5"
                    >
                      <Map className="w-5 h-5 text-mainColor" />
                      {t("map")}
                    </Link>
                  </div>
                </div>
                <div className="flex mb-3 xl:mb-5">
                  <p className="text-mainColor">{t("time")}</p>
                  <span className="ml-1 text-textColor">{range}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 xl:gap-5">
                    <span className="line-through text-dolphin xl:text-lg font-normal">
                      {formatPrice(product?.price)}
                    </span>
                    <PriceFormatter
                      amount={product?.price_in_app}
                      className="font-semibold text-xl xl:text-2xl"
                    />
                    <p></p>
                  </div>
                  <AddToCart product={product} showText />
                </div>
              </div>
              {/* Mobile desc */}
              <div className="sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="p-2 absolute top-4 left-4 sm:hidden backdrop-blur-sm bg-mainColor/30 hover:!bg-mainColor/20 text-white w-[37px] h-[37px] flex items-center justify-center rounded-full "
                >
                  <ArrowLeft className="size-6 text-white" />
                </Button>
                <AddToFavourites product={product} className="absolute top-4 right-4 sm:relative" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className=" text-textColor text-[22px] font-semibold">{product?.title}</p>
                    <div>
                      {(product?.overall_rating ?? 0) > 0 && (
                        <span>
                          <StarIcon
                            size={20}
                            className="text-accordionText fill-accordionText"
                          />{" "}
                          {product?.overall_rating}
                        </span>
                      )}
                      <p className=" text-dolphin text-sm xl:text-base">{product?.business_name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-end">
                    <span className="line-through text-sm text-dolphin xl:text-lg font-normal">
                      {formatPrice(product?.price)}
                    </span>
                    <PriceFormatter
                      amount={product?.price_in_app}
                      className="font-semibold text-xl xl:text-2xl"
                    />
                    <p></p>
                  </div>
                </div>
                <div className="mt-[15px] flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <p className=" text-textColor">{product?.branch_name}</p>
                    <Link href={`/surprise-bag/${product?.id}/map`}>
                      <Map size={16} className="text-mainColor ml-2" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <p>
                      {product?.start_time ? product.start_time.slice(0, 5) : ""} -{" "}
                      {product?.end_time ? product.end_time.slice(0, 5) : ""}
                    </p>
                  </div>
                </div>
                <div className="bg-plasterColor w-full h-[1.5px] my-5"></div>
                <p className="text-dolphin text-sm xl:text-base">{product?.description}</p>
                <AddToCart showText product={product} className="w-full mt-[150px] mb-12.5" />
              </div>
            </div>
            {product &&
              product?.similar_data &&
              product?.similar_data?.length > 0 && (
                <div>
                  <h3 className="page-title mb-10">{t("other-boxes")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
