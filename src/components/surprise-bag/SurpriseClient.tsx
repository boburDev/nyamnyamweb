"use client";

import { getSurpriseBagsByCategory } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Container } from "../container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData } from "@/types";
import { useGetCategory } from "@/hooks";
import SurpriseHeader from "./SurpriseHeader";
import { ProductSwiper } from "../swiper";
interface Props {
  catalog?: string;
  type: string;
  locale: string;
}
const SurpriseClient = ({ catalog, type, locale }: Props) => {
  const [activeTab, setActiveTab] = useState<string>(catalog || "all");
  const { data: product } = useQuery({
    queryKey: ["surprise-bag"],
    queryFn: () => getSurpriseBagsByCategory({ catalog, type, locale }),
  });
  const { data: category } = useGetCategory(locale);
  console.log(product);
  const currentCatalog = useMemo(() => {
    if (activeTab === "all") return null;
    return (
      category?.find((cat: CategoryData) => cat.slug === activeTab)?.slug ||
      null
    );
  }, [activeTab, category]);
  return (
    <div>
      <Container>
        {product?.length > 0 && (
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
              {category?.map((el: CategoryData) => (
                <TabsTrigger
                  key={el.id}
                  value={el.slug}
                  className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-12 capitalize"
                >
                  {el.title}
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
    </div>
  );
};

export default SurpriseClient;
