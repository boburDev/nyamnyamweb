"use client";

import { getSurpriseBagsByCategory } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Container } from "../container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData, ProductData } from "@/types";
import { useGetCategory } from "@/hooks";
import { ProductCard } from "../card";
import { useTranslations } from "next-intl";
interface Props {
  catalog?: string;
  type: string;
  locale: string;
}
const SurpriseClient = ({ catalog, type, locale }: Props) => {
  const t = useTranslations("main")
  const [activeTab, setActiveTab] = useState<string>(catalog || "all");
  const { data: product } = useQuery({
    queryKey: ["surprise-bag", activeTab, type, locale],
    queryFn: () =>
      getSurpriseBagsByCategory({
        catalog: activeTab === "all" ? undefined : activeTab,
        type,
        locale,
      }),
  });

  const { data: category } = useGetCategory(locale);


  return (
    <div className="pt-7.5 lg:pt-12 xl:pt-[122px]">
      <Container>
        <h3 className="font-medium text-[22px] md:text-[28px] xl:text-[36px] text-textColor mb-5 sm:mb-6.5 xl:mb-10">{t("title-2")}</h3>
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
                Hamma
              </TabsTrigger>
              {category?.map((el: CategoryData) => (
                <TabsTrigger
                  key={el.id}
                  value={el.slug}
                  className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[15px] sm:px-5 xl:px-[25px] py-[10.5px] rounded-[20px] sm:rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor sm:h-9.5 xl:h-12 capitalize flex-0 md:!flex-1 shadow-none!"
                >
                  {el.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {category &&
              ["all", ...category.map((c: CategoryData) => c.slug)].map(
                (slug) => (
                  <TabsContent key={slug} value={slug}>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 xl:gap-x-[19px] gap-y-10 xl:gap-y-[50px]">
                      {product?.map((item: ProductData) => (
                        <ProductCard product={item} key={item.id} />
                      ))}
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
