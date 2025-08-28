"use client"

import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSwiper = () => {
    const { data: banners, isLoading, error } = useQuery({
        queryKey: ["banners"],
        queryFn: getBanners,
    });

    if (isLoading) {
        return (
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 rounded-2xl animate-pulse">
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
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 rounded-2xl">
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

    return (
        <div className="relative w-full">
            <Slider {...settings}>
                {banners.map((banner) => (
                    <div key={banner.id} className="px-2">
                        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                            <Image
                                priority
                                src={banner.image}
                                alt={banner.title || "Banner"}
                                fill
                                className="object-cover rounded-2xl"
                            />
                            {(banner.title || banner.description) && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-2xl">
                                    {banner.title && (
                                        <h3 className="text-white text-xl font-bold mb-2">
                                            {banner.title}
                                        </h3>
                                    )}
                                    {banner.description && (
                                        <p className="text-white/90 text-sm">
                                            {banner.description}
                                        </p>
                                    )}
                                </div>
                            )}
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
