"use client";

import { getSurpriseBagsByCategory } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Container } from "../container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData, ProductData } from "@/types";
import { useGetCategory } from "@/hooks";
import { ProductCard } from "../card";
interface Props {
  catalog?: string;
  type: string;
  locale: string;
}
const SurpriseClient = ({ catalog, type, locale }: Props) => {
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
    <div className="py-[122px]">
      <Container>
        <h3 className="page-title mb-10">Super boxlar</h3>
        {category?.length > 0 && (
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
                    <div className="grid grid-cols-3 gap-x-[19px] gap-y-[50px]">
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
