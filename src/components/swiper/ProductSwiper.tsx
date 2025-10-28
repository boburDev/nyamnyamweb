"use client";
import { useSliderArrows } from "@/hooks";
import { ProductCard } from "../card";
import Slider from "react-slick";
import { ProductData } from "@/types";

export const ProductSwiper = ({ product }: { product: ProductData[] }) => {
  const { currentSlide, setCurrentSlide, NextArrow, PrevArrow } =
    useSliderArrows();

  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    nextArrow: (
      <NextArrow onClick={() => { }} currentSlide={currentSlide} total={0} />
    ),
    prevArrow: (
      <PrevArrow onClick={() => { }} currentSlide={currentSlide} total={0} />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
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

  return (
    <div>
      {product?.length >= 4 ? (
        <Slider
          {...{
            ...slickSettings,
            className: "-mx-[8.5px] xl:-mx-[9.5px]",
            nextArrow: (
              <NextArrow
                onClick={() => { }}
                currentSlide={currentSlide}
                total={product?.length}
              />
            ),
            prevArrow: (
              <PrevArrow
                onClick={() => { }}
                currentSlide={currentSlide}
                total={product?.length}
              />
            ),
          }}
        >
          {product?.map((item: ProductData) => {
            return (
              <div key={item.id} className="px-[8.5px] xl:px-[9.5px]">
                <ProductCard product={item} />
              </div>
            );
          })}
        </Slider>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[17px] xl:gap-5">
          {product?.map((item: ProductData) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSwiper;
