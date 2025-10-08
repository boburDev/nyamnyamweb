"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useState } from "react";
import { useLocale } from "next-intl";

import { useGetCategory } from "@/hooks";
import { useGetSupriseBag } from "@/hooks/suprise-bag";
import { Container } from "../container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData } from "@/types";
import { ProductSwiper } from "../swiper";

export const ProductTabs = () => {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("all");
  const { data: category } = useGetCategory(locale);
  const { data: product } = useGetSupriseBag({ locale, slug: activeTab });

  console.log(product);

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

          {category &&
            ["all", ...category.map((c: CategoryData) => c.slug)].map(
              (slug) => (
                <TabsContent key={slug} value={slug}>
                  <div className="space-y-[78px]">
                    {/* popular card */}
                    {product?.popular?.length > 0 && (
                      <div>
                        <h1 className="page-title mb-10">
                          Mashhur brend surprise baglari
                        </h1>
                        <ProductSwiper product={product?.popular} />
                      </div>
                    )}
                    {/* new card */}
                    {product?.new?.length > 0 && (
                      <div>
                        <h1 className="page-title mb-10">
                          Yangi surprise baglar
                        </h1>
                        <ProductSwiper product={product?.new} />
                      </div>
                    )}
                    {product?.morning?.length > 0 && (
                      <div>
                        <h1 className="page-title mb-10">
                          Ertalabki surprise baglar
                        </h1>
                        <ProductSwiper product={product?.morning} />
                      </div>
                    )}
                    {product?.afternoon?.length > 0 && (
                      <div>
                        <h1 className="page-title mb-10">
                          Tushlik uchun surprise baglar
                        </h1>
                        <ProductSwiper product={product?.afternoon} />
                      </div>
                    )}
                  </div>
                </TabsContent>
              )
            )}
        </Tabs>
      </Container>

      <style jsx global>{`
        .slick-dots {
          bottom: -50px !important;
        }
      `}</style>
    </section>
  );
};

export default ProductTabs;
