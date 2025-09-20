"use client";

import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Banner } from "@/types";

export const BannerSwiper = () => {
  const {
    data: banners,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  if (isLoading) {
    return (
      <div className="relative  w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 rounded-2xl animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading banners...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-red-100 rounded-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-500">Error loading banners</div>
        </div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="relative  w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 rounded-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">No banners available</div>
        </div>
      </div>
    );
  }

  const isSingle = banners.length === 1;


  const settings = {
    infinite: !isSingle,
    centerMode: !isSingle,
    centerPadding: isSingle ? "0px" : "20%",
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
  const handleGo = (url: string) => {
    window.open(url, "_blank");
  }

  return (
    <div className="relative w-full mt-20">
      <Slider {...settings}>
        {banners?.map((banner: Banner, index: number) => (
          <div key={index} className="px-2">
            <div onClick={() => handleGo(banner.url)} className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] cursor-pointer">
              <Image
                priority
                src={banner.cover_image}
                alt={banner.url || "Banner"}
                fill
                className="object-cover rounded-2xl"
              />

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
