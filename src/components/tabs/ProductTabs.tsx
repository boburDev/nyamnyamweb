"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

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
  const t = useTranslations("main")
  const t2 = useTranslations("map-preview")
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
    const isTomorrowLocal = localStorage.getItem("weekday");
    if (isTomorrowLocal) {
      localStorage.removeItem("weekday");
    }
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
    <section className="mt-12.5 sm:mt-20 md::mt-[124px] relative">
      <Container>
        {category?.length > 0 && (
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={(v) => setActiveTab(v)}
            className="gap-0"
          >
            {/* 🔹 Category Tabs */}
            <TabsList className="bg-transparent flex gap-2.5 sm:gap-3 xl:gap-[15px] mb-7.5 xl:mb-10 p-0 overflow-x-auto w-full h-12 justify-start md:w-max md:overflow-hidden" style={{ scrollbarWidth: "none" }}>
              <TabsTrigger
                key="all"
                value="all"
                className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[15px] sm:px-5 xl:px-[25px] py-[10.5px] rounded-[20px] sm:rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor sm:h-9.5 xl:h-12 capitalize flex-0 md:!flex-1 shadow-none!"
              >
                {t2("all")}
              </TabsTrigger>
              {category?.map((cat: CategoryData) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.slug}
                  className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[15px] sm:px-5 xl:px-[25px] py-[10.5px] rounded-[20px] sm:rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor sm:h-9.5 xl:h-12 capitalize flex-0 md:!flex-1 shadow-none!"
                >
                  {cat.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {category &&
              ["all", ...category.map((c: CategoryData) => c.slug)].map(
                (slug) => (
                  <TabsContent key={slug} value={slug}>
                    <div className="space-y-9 md:space-y-[56px] xl:space-y-[78px]">
                      {/* popular card */}
                      {product?.popular?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            t={t}
                            title={t("title-1")}
                            catalog={currentCatalog}
                            type="popular"
                            length={product?.popular?.length}
                          />

                          <ProductSwiper product={product?.popular} isTomorrow={false} />
                        </div>
                      )}
                      {product?.recommended?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            t={t}
                            title={t("title-6")}
                            catalog={currentCatalog}
                            type="recommended"
                            length={product?.recommended?.length}
                          />

                          <ProductSwiper product={product?.recommended} isTomorrow={false} />
                        </div>
                      )}
                      {/* new card */}
                      {product?.new?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            t={t}
                            title={t("title-7")}
                            catalog={currentCatalog}
                            type="new"
                            length={product?.new?.length}
                          />
                          <ProductSwiper product={product?.new} isTomorrow={false} />
                        </div>
                      )}
                      {/* morning card */}
                      {product?.morning?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            t={t}
                            title={t("title-5")}
                            catalog={currentCatalog}
                            type="morning"
                            length={product?.morning?.length}
                          />
                          <ProductSwiper product={product?.morning} isTomorrow={false} />
                        </div>
                      )}
                      {/* afternoon card */}
                      {product?.afternoon?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            t={t}
                            title={t("title-3")}
                            catalog={currentCatalog}
                            type="afternoon"
                            length={product?.afternoon?.length}
                          />
                          <ProductSwiper product={product?.afternoon} isTomorrow={false} />
                        </div>
                      )}
                      {/* evening card */}
                      {product?.evening?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            t={t}
                            title={t("title-4")}
                            catalog={currentCatalog}
                            type="evening"
                            length={product?.evening?.length}
                          />
                          <ProductSwiper product={product?.evening} isTomorrow={false} />
                        </div>
                      )}
                      {/* tomorrow */}
                      {product?.tomorrow?.length > 0 && (
                        <div>
                          <SurpriseHeader
                            t={t}
                            title={t("title-5")}
                            catalog={currentCatalog}
                            type="tomorrow"
                            length={product?.tomorrow?.length}
                          />
                          <ProductSwiper product={product?.tomorrow} isTomorrow={true} />
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
