"use client";
import { useSliderArrows } from "@/hooks";
import { ProductCard } from "../card";
import Slider from "react-slick";
import { ProductData } from "@/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

interface ProductSwiperProps {
  product?: ProductData[];
  isTomorrow?: boolean;
}

export const ProductSwiper = ({ product, isTomorrow }: ProductSwiperProps) => {
  const { currentSlide, setCurrentSlide, NextArrow, PrevArrow } =
    useSliderArrows();
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (!width) return null;; // yoki loading skeleton
  const slidesToShow =
    width < 540 ? 1.3 :
      width < 1024 ? 2 :
        width < 1280 ? 3 : 3;

  // Handle empty or undefined product array
  if (!product || product.length === 0) {
    return null;
  }

  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    centerMode: false, // 🔴 markazlashni o‘chiradi
    // responsive: [
    //   {
    //     breakpoint: 2560 * 2,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 1,
    //       dots: true,
    //     },
    //   },
    //   {
    //     breakpoint: 1280,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 1,
    //       dots: true,
    //     },
    //   },
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //       dots: true,
    //     },
    //   },
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //       dots: true,
    //     },
    //   },
    //   {
    //     breakpoint: 640,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //       dots: true,
    //     }
    //   },
    // ],
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    customPaging: () => (
      <div className="w-3 h-1.5 xl:w-[16px] xl:h-[8px] rounded-[5px] bg-[#E0E0E0]" />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div style={{ paddingBottom: 10 }}>
        <ul className="hidden md:flex justify-center [&_li]:w-fit! [&_li]:mx-0.5! md:[&_li]:mx-1!">{dots}</ul>
      </div>
    ),
  };

  const CustomNextArrow = (props: { onClick?: () => void }) => {
    const { onClick } = props;
    return (
      <NextArrow
        onClick={onClick || (() => { })}
        currentSlide={currentSlide}
        total={product.length}
      />
    );
  };

  const CustomPrevArrow = (props: { onClick?: () => void }) => {
    const { onClick } = props;
    return (
      <PrevArrow
        onClick={onClick || (() => { })}
        currentSlide={currentSlide}
        total={product.length}
      />
    );
  };

  return (
    <div className="relative">
      <Slider
        {...slickSettings}
        className="-mx-1.5 md:!-mx-[8.5px] xl:-mx-[9.5px]"
        nextArrow={<CustomNextArrow />}
        prevArrow={<CustomPrevArrow />}
      >
        {product.map((item: ProductData) => (
          <div key={item.id} className="w-auto px-[8.5px] xl:px-[9.5px]">
            <ProductCard product={item} isTomorrow={isTomorrow && item.weekday}  />
          </div>
        ))}
      </Slider>
    </div>
  );
}


export default ProductSwiper;
