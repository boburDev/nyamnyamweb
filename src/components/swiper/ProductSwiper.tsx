"use client";
import { useSliderArrows } from "@/hooks";
import { ProductCard } from "../card";
import Slider from "react-slick";
import { ProductData } from "@/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ProductSwiperProps {
  product?: ProductData[];
}

export const ProductSwiper = ({ product }: ProductSwiperProps) => {
  const { currentSlide, setCurrentSlide, NextArrow, PrevArrow } =
    useSliderArrows();

  // Handle empty or undefined product array
  if (!product || product.length === 0) {
    return null;
  }

  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          dots: true,
        }
      },
    ],
    customPaging: () => (
      <div className="w-3 h-1.5 xl:w-[16px] xl:h-[8px] rounded-[5px] bg-[#E0E0E0]" />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div style={{ paddingBottom: 10 }}>
        <ul className="flex justify-center [&_li]:w-fit!">{dots}</ul>
      </div>
    ),
  };

  // Use swiper only if there are 4 or more items, otherwise use grid (matching ProductCard responsive design)
  if (product.length >= 4) {
    // Create arrow components that accept react-slick's props
    const CustomNextArrow = (props: any) => {
      const { onClick } = props;
      return (
        <NextArrow
          onClick={onClick || (() => { })}
          currentSlide={currentSlide}
          total={product.length}
        />
      );
    };

    const CustomPrevArrow = (props: any) => {
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
          className="-mx-[8.5px] xl:-mx-[9.5px]"
          nextArrow={<CustomNextArrow />}
          prevArrow={<CustomPrevArrow />}
        >
          {product.map((item: ProductData) => (
            <div key={item.id} className="px-[8.5px] xl:px-[9.5px]">
              <ProductCard product={item} />
            </div>
          ))}
        </Slider>
      </div>
    );
  }

  // Grid layout for fewer items (matches ProductCard spacing: gap-[17px] xl:gap-5)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[17px] xl:gap-5">
      {product.map((item: ProductData) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
};

export default ProductSwiper;
