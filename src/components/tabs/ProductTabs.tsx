"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { useState } from "react";
import { useLocale } from "next-intl";

import { useGetCategory, useSliderArrows } from "@/hooks";
import { useGetSupriseBag } from "@/hooks/suprise-bag";
import { Container } from "../container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData } from "@/types";
import { ProductCard } from "../card";
import { Product } from "@/api/product";

export const ProductTabs = () => {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("all");
  const { data: category } = useGetCategory(locale);
  const { data: product } = useGetSupriseBag({ locale, slug: activeTab });
  const { currentSlide, setCurrentSlide, NextArrow, PrevArrow } = useSliderArrows();


  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
  };

  return (
    <section className="mt-[124px] relative">
      <Container>
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={(v) => setActiveTab(v)}
        >
          {/* 🔹 Category Tabs */}
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
                className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-12 capitalize"
              >
                {cat.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 🔹 Tab Content */}
          {category &&
            ["all", ...category.map((c: CategoryData) => c.slug)].map((slug) => (
              <TabsContent key={slug} value={slug}>
                {(() => {
                  const prod = product || {};
                  const orderedSections: [string, Product[]][] = [];

                  if (Array.isArray(prod.popular) && prod.popular.length > 0)
                    orderedSections.push(["popular", prod.popular]);
                  if (
                    Array.isArray(prod.recommended) &&
                    prod.recommended.length > 0
                  )
                    orderedSections.push(["recommended", prod.recommended]);

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
                          <h2 className="page-title capitalize mb-4">
                            {sectionName}
                          </h2>

                          {items.length >= 4 ? (
                            <Slider
                              {...{
                                ...slickSettings,
                                nextArrow: (
                                  <NextArrow
                                    onClick={() => { }}
                                    currentSlide={currentSlide}
                                    total={items.length}
                                  />
                                ),
                                prevArrow: (
                                  <PrevArrow
                                    onClick={() => { }}
                                    currentSlide={currentSlide}
                                    total={items.length}
                                  />
                                ),
                              }}
                            >
                              {items.map((item: Product) => (
                                <div key={item.id} className="px-[5.5px]">
                                  <ProductCard item={item} />
                                </div>
                              ))}
                            </Slider>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {items.map((item: Product) => (
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
      </Container>

      {/* ✅ Global style for slick dots */}
      <style jsx global>{`
        .slick-dots {
          bottom: -50px !important;
        }
      `}</style>
    </section>
  );
};

export default ProductTabs;
