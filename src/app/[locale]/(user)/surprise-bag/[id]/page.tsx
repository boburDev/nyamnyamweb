
import Image from "next/image";
import { Map, StarIcon } from "lucide-react";
import { getSurpriseBagSingle } from "@/api";
import { Container } from "@/components/container";
import { PriceFormatter } from "@/components/price-format";
import { ProductData } from "@/types";
import { formatTimeRangeInTz } from "@/utils/time";
import { ProductCard } from "@/components/card";
import { FavouriteButton } from "@/components/add-to-cart";
import AddToSingle from "@/components/add-to-cart/AddToSingle";
import { Link } from "@/i18n/navigation";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}
const SurpriseBagSinglePage = async ({ params }: Props) => {
  const { id, locale } = await params;
  const product: ProductData = await getSurpriseBagSingle({ id, locale });
  const range = formatTimeRangeInTz(product?.start_time, product?.end_time);
  return (
    <div className="py-20">
      <Container>
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
              <FavouriteButton product={product} />
            </div>
            <div className="flex items-center justify-between mb-[23px]">
              <p className="text-textColor text-base">
                {product?.business_name}
              </p>
              {!product?.overall_rating && (
                <span>
                  <StarIcon size={20} className="text-accordionText fill-accordionText" />{" "}
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
                  {Number(product?.distance).toFixed(1)} km
                </span>
              </div>
              <div className="flex items-center">
                <Link
                  href={`/surprise-bag/${product.id}/map`}
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
                <PriceFormatter
                  amount={product?.price}
                  className="line-through text-dolphin text-lg font-normal"
                  summ={false}
                />
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
                {product?.similar_data?.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
      </Container>
    </div>
  );
};

export default SurpriseBagSinglePage;
