"use client"

import { useState, useEffect } from "react";
import { Star, Bookmark, ShoppingCart, Dot, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "@/api/product";
import { Button } from "../ui/button";
import { ProductSkeletons } from "../loader/DataLoader";

interface ProductSwiperProps {
  products: Product[];
  title?: string;
  isLoading?: boolean;
}

export const ProductSwiper = ({ products, title, isLoading = false }: ProductSwiperProps) => {
  const [isBookmarked, setIsBookmarked] = useState<{ [key: number]: boolean }>({});
  const [isInCart, setIsInCart] = useState<{ [key: number]: boolean }>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleBookmark = (productId: number) => {
    setIsBookmarked((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const toggleCart = (productId: number) => {
    setIsInCart((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const NextArrow = ({ onClick, currentSlide, total }: any) => {
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
          ${isDisabled ? "bg-[#e0e0e0] cursor-not-allowed" : "bg-mainColor hover:bg-green-600"}`}
      >
        <ChevronRight
          className={`w-6 h-6 ${isDisabled ? "text-gray-400" : "text-white"}`}
        />
      </button>
    );
  };

  const PrevArrow = ({ onClick, currentSlide, total }: any) => {
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
          ${isDisabled ? "bg-[#e0e0e0] cursor-not-allowed" : "bg-mainColor hover:bg-green-600"}`}
      >
        <ChevronLeft
          className={`w-6 h-6 ${isDisabled ? "text-gray-400" : "text-white"}`}
        />
      </button>
    );
  };



  // Determine if this is the "All" category (showing all products)
  const isAllCategory = products.length > 6; // Assuming "All" has more products than individual categories

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
    nextArrow: <NextArrow currentSlide={currentSlide} total={products.length} />,
    prevArrow: <PrevArrow currentSlide={currentSlide} total={products.length} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        }
      }
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
              <div key={product.id} className="px-3">
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
                      <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                        {product.stock} ta qoldi
                      </div>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isBookmarked[product.id] || product.isBookmarked
                          ? "fill-mainColor text-mainColor"
                          : "text-dolphin"
                          }`}
                      />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    {/* Rating and Name */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star fill="#F8B133" stroke="#F8B133" className="w-4 h-4" />
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

                    <div className="flex gap-[10px] justify-between">
                      {/* Price */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-mainColor font-semibold text-lg">
                          {product.currentPrice}
                        </span>
                        <span className="text-dolphin line-through text-sm">
                          {product.originalPrice}
                        </span>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleCart(product.id)}
                          className={`flex-1 h-10 rounded-lg flex items-center justify-center transition-colors ${isInCart[product.id] || product.isInCart
                            ? "bg-mainColor text-white"
                            : "bg-gray-100 !text-mainColor hover:bg-gray-200"}`}
                        >
                          <ShoppingCart className={`w-4 h-4 flex-1 flex items-center justify-center transition-colors`} />
                        </Button>
                        <Button className="flex-1 h-10 bg-gray-100 !text-mainColor rounded-lg font-medium hover:bg-gray-200 transition-colors">
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
