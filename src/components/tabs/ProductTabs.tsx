"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

import { useGetCategory } from "@/hooks";
import { Container } from "../container";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData } from "@/types";
import { useGetSupriseBag } from "@/hooks/suprise-bag";
import { useLocale } from "next-intl";
import { ProductCard } from "../card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ProductTabs = () => {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("all");
  const { data: category } = useGetCategory(locale);
  const { data: product } = useGetSupriseBag({ locale, slug: activeTab });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  console.log(product);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const NextArrow = (props: any) => {
    const { onClick, currentSlide: cs, slideCount } = props;
    const total = slideCount;
    const shouldHideArrow = () => {
      if (windowWidth <= 768) return total <= 1;
      if (windowWidth <= 1024) return total <= 2;
      return total <= 3;
    };
    if (shouldHideArrow()) return null;
    const getMaxSlide = () => {
      if (windowWidth <= 768) return total - 1;
      if (windowWidth <= 1024) return total - 2;
      return total - 3;
    };
    const isDisabled = cs >= getMaxSlide();
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`absolute right-[-10px] top-1/2 -translate-y-1/2 z-50 p-2 rounded-full transition
          ${
            isDisabled
              ? "bg-white border border-mainColor cursor-not-allowed"
              : "bg-mainColor hover:bg-green-600"
          }`}
      >
        <ChevronRight
          className={`w-6 h-6 ${isDisabled ? "text-mainColor" : "text-white"}`}
        />
      </button>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick, currentSlide: cs } = props;
    const total = props.slideCount;
    const shouldHideArrow = () => {
      if (windowWidth <= 768) return total <= 1;
      if (windowWidth <= 1024) return total <= 2;
      return total <= 3;
    };
    if (shouldHideArrow()) return null;
    const isDisabled = cs === 0;
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`absolute left-[-10px] top-1/2 -translate-y-1/2 z-50 p-2 rounded-full transition
          ${
            isDisabled
              ? "bg-white border border-mainColor cursor-not-allowed"
              : "bg-mainColor hover:bg-green-600"
          }`}
      >
        <ChevronLeft
          className={`w-6 h-6 ${isDisabled ? "text-mainColor" : "text-white"}`}
        />
      </button>
    );
  };

  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    nextArrow: <NextArrow currentSlide={currentSlide} slideCount={0} />,
    prevArrow: <PrevArrow currentSlide={currentSlide} slideCount={0} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="mt-[124px]">
      <Container>
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className=""
        >
          <TabsList className="bg-transparent flex gap-[15px] mb-10">
            <TabsTrigger
              key="all"
              value="all"
              className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-12 capitalize"
            >
              Hamma
            </TabsTrigger>
            {category?.map((cat: CategoryData) => (
              <TabsTrigger
                key={cat.id}
                value={cat.slug}
                className="data-[state=active]:!bg-mainColor data_[state=active]:!text-white !text-textColor font-medium data_[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data_[state=active]:!border-mainColor h-12 capitalize"
              >
                {cat.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            {(() => {
              const prod = product || {};
              const orderedSections: [string, any[]][] = [];

              if (Array.isArray(prod.popular) && prod.popular.length > 0) {
                orderedSections.push(["popular", prod.popular]);
              }
              if (
                Array.isArray(prod.recommended) &&
                prod.recommended.length > 0
              ) {
                orderedSections.push(["recommended", prod.recommended]);
              }

              Object.entries(prod).forEach(([key, items]) => {
                if (
                  key !== "popular" &&
                  key !== "recommended" &&
                  Array.isArray(items) &&
                  items.length > 0
                ) {
                  orderedSections.push([key, items]);
                }
              });

              return (
                <div className="space-y-10">
                  {orderedSections.map(([sectionName, items]) => (
                    <div key={sectionName}>
                      <h2 className="text-xl font-semibold capitalize mb-4">
                        {sectionName}
                      </h2>

                      {items.length > 4 ? (
                        <Slider
                          {...{
                            ...slickSettings,
                            nextArrow: (
                              <NextArrow
                                currentSlide={currentSlide}
                                slideCount={items.length}
                              />
                            ),
                            prevArrow: (
                              <PrevArrow
                                currentSlide={currentSlide}
                                slideCount={items.length}
                              />
                            ),
                          }}
                        >
                          {items.map((item: any) => (
                            <div key={item.id} className="px-2">
                              <ProductCard item={item} />
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {items.map((item: any) => (
                            <ProductCard key={item.id} item={item} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </TabsContent>

          {category?.map((cat) => (
            <TabsContent key={cat.id} value={cat.slug}>
              {(() => {
                const prod = product || {};
                const orderedSections: [string, any[]][] = [];

                if (Array.isArray(prod.popular) && prod.popular.length > 0) {
                  orderedSections.push(["popular", prod.popular]);
                }
                if (
                  Array.isArray(prod.recommended) &&
                  prod.recommended.length > 0
                ) {
                  orderedSections.push(["recommended", prod.recommended]);
                }

                Object.entries(prod).forEach(([key, items]) => {
                  if (
                    key !== "popular" &&
                    key !== "recommended" &&
                    Array.isArray(items) &&
                    items.length > 0
                  ) {
                    orderedSections.push([key, items]);
                  }
                });

                return (
                  <div className="space-y-10">
                    {orderedSections.map(([sectionName, items]) => (
                      <div key={sectionName}>
                        <h2 className="text-xl font-semibold capitalize mb-4">
                          {sectionName}
                        </h2>

                        {items.length > 4 ? (
                          <Slider
                            {...{
                              ...slickSettings,
                              nextArrow: (
                                <NextArrow
                                  currentSlide={currentSlide}
                                  slideCount={items.length}
                                />
                              ),
                              prevArrow: (
                                <PrevArrow
                                  currentSlide={currentSlide}
                                  slideCount={items.length}
                                />
                              ),
                            }}
                          >
                            {items.map((item: any) => (
                              <div key={item.id} className="px-2">
                                <ProductCard item={item} />
                              </div>
                            ))}
                          </Slider>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item: any) => (
                              <ProductCard key={item.id} item={item} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </TabsContent>
          ))}
        </Tabs>
      </Container>{" "}
      <style jsx global>{`
        .slick-dots {
          bottom: -50px !important;
        }
      `}</style>
    </section>
  );
};

export default ProductTabs;
