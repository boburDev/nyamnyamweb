"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Bookmark,
  ShoppingCart,
  Dot,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "@/api/product";
import { Button } from "../ui/button";
import { ProductSkeletons } from "../loader/DataLoader";
import useCartStore from "@/context/cartStore";
import useFavouriteStore from "@/context/favouriteStore";
import { showToast } from "../toast/Toast";
import { formatPrice } from "@/utils/price-format";
import PriceFormatter from "../price-format/PriceFormatter";

interface ProductSwiperProps {
  products: Product[];
  title?: string;
  isLoading?: boolean;
}

export const ProductSwiper = ({
  products,
  title,
  isLoading = false,
}: ProductSwiperProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Cart store
  const { addToCart, removeFromCart, isInCart } = useCartStore();

  // Favourite store
  const { toggleFavourite, isFavourite } = useFavouriteStore();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleBookmark = (product: Product) => {
    const isCurrentlyFavourite = isFavourite(product.id);
    toggleFavourite(product);
    showToast({
      title: isCurrentlyFavourite
        ? "Saqlangan mahsulotlardan o'chirildi"
        : "Saqlangan mahsulotlarga qo'shildi",
      type: isCurrentlyFavourite ? "info" : "success",
      href: "/favourite",
      hrefName: "Saqlangan mahsulotlar",
    });
  };

  const toggleCart = (product: Product) => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
      showToast({
        title: "Savatdan o'chirildi",
        type: "info",
        href: "/cart",
        hrefName: "Savatga o'tish",
      });
    } else {
      addToCart(product);
      showToast({
        title: "Savatga qo'shildi",
        type: "success",
        href: "/cart",
        hrefName: "Savatga o'tish",
      });
    }
  };

  const NextArrow = ({
    onClick,
    currentSlide,
    total,
  }: {
    onClick: () => void;
    currentSlide: number;
    total: number;
  }) => {
    // Hide arrow if not enough products to scroll (responsive)
    const shouldHideArrow = () => {
      if (windowWidth <= 768) return total <= 1;
      if (windowWidth <= 1024) return total <= 2;
      return total <= 3;
    };

    if (shouldHideArrow()) return null;

    // Calculate max slide based on responsive settings
    const getMaxSlide = () => {
      if (windowWidth <= 768) return total - 1; // 1 slide shown
      if (windowWidth <= 1024) return total - 2; // 2 slides shown
      return total - 3; // 3 slides shown
    };

    const isDisabled = currentSlide >= getMaxSlide();
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`absolute right-[-10px] top-1/2 -translate-y-1/2 z-50 p-2 rounded-full transition
          ${
            isDisabled
              ? "bg-[#e0e0e0] cursor-not-allowed"
              : "bg-mainColor hover:bg-green-600"
          }`}
      >
        <ChevronRight
          className={`w-6 h-6 ${isDisabled ? "text-gray-400" : "text-white"}`}
        />
      </button>
    );
  };

  const PrevArrow = ({
    onClick,
    currentSlide,
    total,
  }: {
    onClick: () => void;
    currentSlide: number;
    total: number;
  }) => {
    // Hide arrow if not enough products to scroll (responsive)
    const shouldHideArrow = () => {
      if (windowWidth <= 768) return total <= 1;
      if (windowWidth <= 1024) return total <= 2;
      return total <= 3;
    };

    if (shouldHideArrow()) return null;

    const isDisabled = currentSlide === 0;
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`absolute left-[-10px] top-1/2 -translate-y-1/2 z-50 p-2 rounded-full transition
          ${
            isDisabled
              ? "bg-[#e0e0e0] cursor-not-allowed"
              : "bg-mainColor hover:bg-green-600"
          }`}
      >
        <ChevronLeft
          className={`w-6 h-6 ${isDisabled ? "text-gray-400" : "text-white"}`}
        />
      </button>
    );
  };

  // Determine if this is the "All" category (showing all products)
  // const isAllCategory = products.length > 6; // Assuming "All" has more products than individual categories

  const settings = {
    dots: products.length > 3, // Only show dots if more than 3 products
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Show all products if less than 3
    slidesToScroll: 1,
    centerMode: false, // Disable center mode to start from beginning
    centerPadding: "0px",
    pagination: true,
    // lazyLoad: true,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    nextArrow: (
      <NextArrow
        onClick={() => {}}
        currentSlide={currentSlide}
        total={products.length}
      />
    ),
    prevArrow: (
      <PrevArrow
        onClick={() => {}}
        currentSlide={currentSlide}
        total={products.length}
      />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
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
    <div className="relative">
      {title && (
        <div className="mb-6 flex justify-between items-center">
          <h2 className="font-medium text-4xl text-textColor">{title}</h2>
          <button className="flex items-center gap-2 text-mainColor hover:text-green-600 transition-colors">
            <span className="font-medium text-[20px]">Ko'proq ko'rish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative">
        <Slider {...settings} className="product-swiper">
          {isLoading ? (
            // Show loading skeletons
            <ProductSkeletons count={6} />
          ) : (
            // Show actual products
            products.map((product) => (
              <div key={product.id} className="px-[5.5px]">
                <div className="bg-white rounded-[25px] border border-gray-100">
                  {/* Product Image */}
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-[200px] object-cover rounded-t-[25px]"
                    />

                    {/* Stock Badge */}
                    {product.stock && product.stock <= 5 && (
                      <div className="absolute top-3 left-3 bg-mainColor/20 rounded-full px-[14px] py-2 text-sm font-medium text-white backdrop-blur-[45px]">
                        {product.stock} ta qoldi
                      </div>
                    )}
                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(product)}
                      className="absolute top-3 right-3 px-[9px] py-[6.5px] bg-white rounded-[15px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Bookmark
                        className={`w-[24px] h-[24px] ${
                          isFavourite(product.id) || product.isBookmarked
                            ? "fill-mainColor text-mainColor"
                            : "text-mainColor"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    {/* Rating and Name */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star
                          fill="#F8B133"
                          stroke="#F8B133"
                          className="w-4 h-4"
                        />
                        <span className="text-textColor font-medium text-sm">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-textColor font-medium text-lg">
                        {product.name}
                      </span>
                    </div>

                    {/* Restaurant and Distance */}
                    <div className="flex items-center gap-1 mb-3 text-dolphin text-sm">
                      <span className="font-medium">{product.restaurant}</span>
                      <Dot className="w-4 h-4" />
                      <span className="font-medium">{product.distance} km</span>
                    </div>

                    <div className="flex gap-[10px] justify-between items-center">
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <PriceFormatter
                          amount={product.currentPrice}
                          className="text-lg"
                        />
                        <span className="text-dolphin line-through text-sm flex-shrink-0">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleCart(product)}
                          className={`flex-1 h-10 rounded-lg flex items-center justify-center transition-colors hover:!text-white ${
                            isInCart(product.id) || product.isInCart
                              ? "bg-mainColor text-white"
                              : "bg-gray-100 !text-mainColor hover:bg-gray-200"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                        <Button className="flex-1 h-10 bg-gray-100 !text-mainColor rounded-lg hover:!text-white font-medium hover:bg-gray-200 transition-colors">
                          Batafsil
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </Slider>
      </div>

      <style jsx global>{`
        .slick-dots {
          bottom: -50px !important;
        }
      `}</style>
    </div>
  );
};

export default ProductSwiper;
