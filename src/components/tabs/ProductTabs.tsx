"use client";

import { useGetCategory } from "@/hooks";
import { Container } from "../container";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData } from "@/types";

export const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { data: category } = useGetCategory();
  console.log("activeTab", activeTab);
  

  return (
    <section className="mt-[124px]">
      <Container>
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="bg-white shadow-productListShadow"
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
                value={cat.id}
                className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-12 capitalize"
              >
                {cat.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Container>
    </section>
  );
};

export default ProductTabs;
