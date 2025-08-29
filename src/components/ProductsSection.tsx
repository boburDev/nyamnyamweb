"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/product";
import CategoryTabs from "./tabs/CategoryTabs";
import ProductSwiper from "./swiper/ProductSwiper";
import { Container } from "./container";

const ProductsSection = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);

    const { data: allProducts = [], isLoading } = useQuery({
        queryKey: ["products", selectedCategoryId],
        queryFn: () => getProducts(selectedCategoryId),
    });

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
    };

    // Filter products by category
    const getProductsByCategory = (categoryId: number) => {
        if (selectedCategoryId === 1) {
            // When "Hamma" is selected, filter from all products
            return allProducts.filter(product => product.categoryId === categoryId);
        }
        // When specific category is selected, return all products for that category
        return allProducts;
    };

    // Get recommended products (first 3 products from each category)
    const getRecommendedProducts = (categoryId: number) => {
        const categoryProducts = getProductsByCategory(categoryId);
        return categoryProducts.slice(0, 6);
    };

    // Render multiple sections for "Hamma" category
    const renderAllSections = () => {
        return (
            <>
                {/* Recommended Super Boxes */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getRecommendedProducts(2)}
                        title="Tavsiya etilgan Super boxlar"
                    />
                </div>

                {/* Super Boxes */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getProductsByCategory(2)}
                        title="Super boxlar"
                    />
                </div>

                {/* Meals */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getProductsByCategory(3)}
                        title="Taomlar"
                    />
                </div>

                {/* Fast Food */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getProductsByCategory(4)}
                        title="Fast food"
                    />
                </div>

                {/* Desserts */}
                <div className="mb-16">
                    <ProductSwiper
                        products={getProductsByCategory(5)}
                        title="Shirinliklar"
                    />
                </div>
            </>
        );
    };

    // Render single section for specific category
    const renderSingleSection = () => {
        const getCategoryTitle = () => {
            switch (selectedCategoryId) {
                case 2:
                    return "Super boxlar";
                case 3:
                    return "Taomlar";
                case 4:
                    return "Fast food";
                case 5:
                    return "Shirinliklar";
                default:
                    return "Mahsulotlar";
            }
        };

        return (
            <div className="">
                <ProductSwiper
                    products={allProducts}
                    title={getCategoryTitle()}
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

            {isLoading ? (
                <div className="flex justify-center items-center h-64 mt-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
                </div>
            ) : (
                <>
                    {selectedCategoryId === 1 ? renderAllSections() : renderSingleSection()}
                </>
            )}
        </Container>
    );
};

export default ProductsSection;
