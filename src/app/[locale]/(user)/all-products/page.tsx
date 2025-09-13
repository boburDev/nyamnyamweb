"use client"
import AllProductsComponent from '@/components/all-products/AllProductsComponent'
import { Container } from '@/components/container'
import CategoryTabs from '@/components/tabs/CategoryTabs'
import { getCategories } from '@/api/category'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

const AllProductsPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId === 1 ? undefined : categoryId);
  };

  // Get the current category name
  const getCurrentCategoryName = () => {
    if (selectedCategoryId) {
      const category = categories.find(cat => cat.id === selectedCategoryId);
      return category ? category.name : "Barcha mahsulotlar";
    }
    return "Barcha mahsulotlar";
  };

  return (
    <Container>
      <h3 className='page-title mt-[118px] mb-10'>{getCurrentCategoryName()}</h3>
      <CategoryTabs
        onCategoryChange={handleCategoryChange}
        selectedCategoryId={selectedCategoryId}
      >
        <AllProductsComponent selectedCategoryId={selectedCategoryId} />
      </CategoryTabs>
    </Container>
  )
}

export default AllProductsPage