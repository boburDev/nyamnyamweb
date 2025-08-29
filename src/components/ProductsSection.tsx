"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getAllProductCategories, prefetchAllProducts } from "@/api/product";
import CategoryTabs from "./tabs/CategoryTabs";
import ProductSwiper from "./swiper/ProductSwiper";
import { Container } from "./container";
import { PageLoader } from "./loader/PageLoader";

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

    // Get products by category from prefetched data
    const getProductsByCategory = (categoryId: number) => {
        if (!prefetchedData) return [];

        if (selectedCategoryId === 1) {
            // When "Hamma" is selected, filter from all products
            return prefetchedData.allProducts.filter(product => product.categoryId === categoryId);
        }
        // When specific category is selected, return all products for that category
        return categoryProducts;
    };

    // Get recommended products (first 6 products from each category)
    const getRecommendedProducts = (categoryId: number) => {
        const categoryProducts = getProductsByCategory(categoryId);
        return categoryProducts.slice(0, 6);
    };



    // Render multiple sections for "Hamma" category
    const renderAllSections = () => {
        if (!prefetchedData) return <PageLoader message="Mahsulotlar yuklanmoqda..." />;

        return (
            <>
                {/* Recommended Super Boxes */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getRecommendedProducts(2)}
                        title="Tavsiya etilgan Super boxlar"
                        isLoading={!prefetchedData}
                    />
                </div>

                {/* Super Boxes */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getProductsByCategory(2)}
                        title="Super boxlar"
                        isLoading={!prefetchedData}
                    />
                </div>

                {/* Meals */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getProductsByCategory(3)}
                        title="Taomlar"
                        isLoading={!prefetchedData}
                    />
                </div>

                {/* Fast Food */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getProductsByCategory(4)}
                        title="Fast food"
                        isLoading={!prefetchedData}
                    />
                </div>

                {/* Desserts */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getProductsByCategory(5)}
                        title="Shirinliklar"
                        isLoading={!prefetchedData}
                    />
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

        if (isCategoryLoading) return <PageLoader message="Mahsulotlar yuklanmoqda..." />;

        return (
            <div className="">
                <ProductSwiper
                    products={categoryProducts}
                    title={getCategoryTitle()}
                    isLoading={isCategoryLoading}
                />
            </div>
        );
    };

    return (
        <Container className="mt-[124px]">
            <CategoryTabs
                onCategoryChange={handleCategoryChange}
                selectedCategoryId={selectedCategoryId}
            />

            {selectedCategoryId === 1 ? renderAllSections() : renderSingleSection()}
        </Container>
    );
};

export default ProductsSection;
