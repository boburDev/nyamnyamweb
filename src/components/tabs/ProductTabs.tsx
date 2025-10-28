"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";

import { useGetCategory } from "@/hooks";
import { useGetSupriseBag } from "@/hooks/suprise-bag";
import { Container } from "../container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData } from "@/types";
import { ProductSwiper } from "../swiper";
import { SurpriseHeader } from "../surprise-bag";
import { useLocationStore } from "@/context/userStore";
import { DataLoader } from "../loader";

export const ProductTabs = () => {
  const locale = useLocale();
  const coords = useLocationStore((s) => s.coords);
  const [client, setClient] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { data: category } = useGetCategory(locale);
  const { data: product } = useGetSupriseBag({
    locale,
    slug: activeTab,
    lat: coords?.lat,
    lon: coords?.lon,
  });

  useEffect(() => {
    setClient(true);
  }, []);

  const currentCatalog = useMemo(() => {
    if (activeTab === "all") return null;
    return (
      category?.find((cat: CategoryData) => cat.slug === activeTab)?.slug ||
      null
    );
  }, [activeTab, category]);
  if (!client) return <DataLoader />;
  return (
    <section className="mt-[124px] relative">
      <Container>
        {category?.length > 0 && (
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={(v) => setActiveTab(v)}
          >
            {/* 🔹 Category Tabs */}
            <TabsList className="bg-transparent flex gap-3 xl:gap-[15px] mb-7.5 xl:mb-10 p-0">
              <TabsTrigger
                key="all"
                value="all"
                className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-5 xl:px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-9.5 xl:h-12 capitalize"
              >
                Hamma
              </TabsTrigger>
              {category?.map((cat: CategoryData) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.slug}
                  className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-5 xl:px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-9.5 xl:h-12 capitalize"
                >
                  {cat.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {category &&
              ["all", ...category.map((c: CategoryData) => c.slug)].map(
                (slug) => (
                  <TabsContent key={slug} value={slug}>
                    <div className="space-y-[56px] xl:space-y-[78px]">
                      {/* popular card */}
                      {product?.popular?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            title="Mashhur surprise baglar"
                            catalog={currentCatalog}
                            type="popular"
                            length={product?.popular?.length}
                          />

                          <ProductSwiper product={product?.popular} />
                        </div>
                      )}
                      {product?.recommended?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            title="Tavsiya etilgan surprise baglar"
                            catalog={currentCatalog}
                            type="recommended"
                            length={product?.recommended?.length}
                          />

                          <ProductSwiper product={product?.recommended} />
                        </div>
                      )}
                      {/* new card */}
                      {product?.new?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            title="Yangi surprise baglar"
                            catalog={currentCatalog}
                            type="new"
                            length={product?.new?.length}
                          />
                          <ProductSwiper product={product?.new} />
                        </div>
                      )}
                      {/* morning card */}
                      {product?.morning?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            title="Ertalabki surprise baglar"
                            catalog={currentCatalog}
                            type="new"
                            length={product?.morning?.length}
                          />
                          <ProductSwiper product={product?.morning} />
                        </div>
                      )}
                      {/* afternoon card */}
                      {product?.afternoon?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            title="Tushlik uchun surprise baglar"
                            catalog={currentCatalog}
                            type="new"
                            length={product?.afternoon?.length}
                          />
                          <ProductSwiper product={product?.afternoon} />
                        </div>
                      )}
                      {/* evening card */}
                      {product?.evening?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            title="Kechki surprise baglar"
                            catalog={currentCatalog}
                            type="new"
                            length={product?.evening?.length}
                          />
                          <ProductSwiper product={product?.evening} />
                        </div>
                      )}
                      {/* tomorrow */}
                      {product?.tomorrow?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            title=" Ertangi surprise baglar"
                            catalog={currentCatalog}
                            type="tomorrow"
                            length={product?.tomorrow?.length}
                          />
                          <ProductSwiper product={product?.tomorrow} />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )
              )}
          </Tabs>
        )}
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
