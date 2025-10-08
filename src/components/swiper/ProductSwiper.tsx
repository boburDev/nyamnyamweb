"use client";
import { useSliderArrows } from "@/hooks";
import { ProductCard } from "../card";
import Slider from "react-slick";
import { ProductData } from "@/types";

export const ProductSwiper = ({ product }: { product: ProductData[] }) => {
  const { currentSlide, setCurrentSlide, NextArrow, PrevArrow } =
    useSliderArrows();

  const slidesToShow = 3;

  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    nextArrow: (
      <NextArrow onClick={() => {}} currentSlide={currentSlide} total={0} />
    ),
    prevArrow: (
      <PrevArrow onClick={() => {}} currentSlide={currentSlide} total={0} />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
    customPaging: () => (
      <div className="w-[16px] h-[8px] rounded-[5px] bg-[#E0E0E0]" />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div style={{ marginTop: "20px" }}>
        <ul className="flex justify-center ">{dots}</ul>
      </div>
    ),
  };

  return (
    <div>
      {product?.length >= 4 ? (
        <Slider
          {...{
            ...slickSettings,
            nextArrow: (
              <NextArrow
                onClick={() => {}}
                currentSlide={currentSlide}
                total={product?.length}
              />
            ),
            prevArrow: (
              <PrevArrow
                onClick={() => {}}
                currentSlide={currentSlide}
                total={product?.length}
              />
            ),
          }}
        >
          {product?.map((item: ProductData, index: number) => {
            const isLastVisible =
              index === currentSlide + slidesToShow - 1 ||
              index === product.length - 1;

            return (
              <div key={item.id} className={isLastVisible ? "pr-0" : "pr-5"}>
                <ProductCard product={item} />
              </div>
            );
          })}
        </Slider>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product?.map((item: ProductData) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSwiper;
