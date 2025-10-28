"use client";

import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Banner } from "@/types";
import { BannerSkeleton } from "../loader/DataLoader";
import { Link } from "@/i18n/navigation";

export const BannerSwiper = () => {
  const {
    data: banners,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  if (isLoading) return <BannerSkeleton />;

  if (error)
    return (
      <div className="relative w-full aspect-[16/9] bg-red-100 rounded-2xl flex items-center justify-center">
        <div className="text-red-500">Error loading banners</div>
      </div>
    );

  if (!banners || banners.length === 0)
    return (
      <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-gray-500">No banners available</div>
      </div>
    );

  const isSingle = banners.length === 1;

  const settings = {
    infinite: !isSingle,
    centerMode: !isSingle,
    centerPadding: isSingle ? "0px" : "60px",
    slidesToShow: 1,
    autoplay: !isSingle,
    autoplaySpeed: 3000,
    speed: 800,
    dots: !isSingle,
    arrows: false,
    customPaging: () => (
      <div className="w-[16px] h-[8px] rounded-[5px] bg-[#E0E0E0]" />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div style={{ marginTop: "20px" }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
  };

  return (
    <div className="relative w-full mt-10">
      <Slider {...settings}>
        {banners?.map((banner: Banner, index: number) => (
          <div key={index} className="px-1 sm:px-2">
            <div className="relative w-full aspect-[16/9] cursor-pointer">
              <Link href={banner.url} target="_blank" className="block h-full w-full max-w-[1220px]! max-h-[746px]!">
                <Image
                  priority
                  src={banner.cover_image}
                  alt={banner.url || "Banner"}
                  fill
                  className="object-cover rounded-2xl"
                />
              </Link>
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .slick-dots li.slick-active div {
          background: #4fb477 !important;
        }
      `}</style>
    </div>
  );
};

export default BannerSwiper;
