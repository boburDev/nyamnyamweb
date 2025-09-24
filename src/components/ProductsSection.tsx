"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getAllProductCategories, prefetchAllProducts } from "@/api/product";
import CategoryTabs from "./tabs/CategoryTabs";
import ProductSwiper from "./swiper/ProductSwiper";
import { Container } from "./container";
import { ProductSkeletonGrid } from "./loader/DataLoader";

const ProductsSection = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);

  // Use prefetched data for better performance
  const { data: prefetchedData } = useQuery({
    queryKey: ["products", "all"],
    queryFn: prefetchAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get categories data
  const { data: categories = [] } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getAllProductCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });


  // Get products for selected category
  const { data: categoryProducts = [], isLoading: isCategoryLoading } = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => getProducts(selectedCategoryId),
    enabled: selectedCategoryId !== 1, // Only fetch when specific category is selected
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };



  // Render multiple sections for "Hamma" category
  const renderAllSections = () => {
    if (!prefetchedData) return (
      <div className="mt-6">
        <ProductSkeletonGrid count={8} />
      </div>
    )

    return (
      <>
        {/* All Products */}
        <div className="mb-16 flex flex-col gap-[80px]">
          {
            prefetchedData.categories.map((category) => (
              <ProductSwiper
                key={category.categoryId}
                products={category.products}
                title={category.category}
                isLoading={isCategoryLoading}
                categoryId={category.categoryId === 1 ? 2 : category.categoryId}
              />
            ))
          }
        </div>
      </>
    );
  };

  // Render single section for specific category
  const renderSingleSection = () => {
    const getCategoryTitle = () => {
      const category = categories.find(cat => cat.categoryId === selectedCategoryId);
      return category ? category.category : "Mahsulotlar";
    };

    if (isCategoryLoading) return (
      <div className="mt-6">
        <ProductSkeletonGrid count={6} />
      </div>
    );

    return (
      <div className="">
        <ProductSwiper
          products={categoryProducts}
          title={getCategoryTitle()}
          isLoading={isCategoryLoading}
          categoryId={selectedCategoryId}
        />
      </div>
    );
  };

  return (
    <Container className="mt-[124px]">
      <CategoryTabs
        onCategoryChange={handleCategoryChange}
        selectedCategoryId={selectedCategoryId}
      >
        {selectedCategoryId === 1 ? renderAllSections() : renderSingleSection()}
      </CategoryTabs>
    </Container>
  );
};

export default ProductsSection;
