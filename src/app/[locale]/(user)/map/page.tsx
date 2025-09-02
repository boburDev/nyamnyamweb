"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';
import { SurpriseBagCard } from "@/components/surprise-bag/SurpriseBagCard";
import { MapControls } from "@/components/map/MapControls";
import CategoryTabs from "@/components/tabs/CategoryTabs";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/product";
import { getCategories } from "@/api/category";
import { Product } from "@/api/product";
import { Container } from "@/components/container";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectComponent from "@/components/select/Select";
import { DataLoader } from "@/components/loader/DataLoader";
import { Pagination } from "@/components/ui/pagination";

// Dynamically import the map component to avoid SSR issues
const YandexMap = dynamic(() => import('@/components/map/YandexMap'), {
  ssr: false,
});

const MapPage = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [isPageChanging, setIsPageChanging] = useState<boolean>(false);
  const [isCategoryChanging, setIsCategoryChanging] = useState<boolean>(false);
  const mapRef = useRef<any>(null);

  // Fetch products and categories
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => getProducts(selectedCategoryId),
    staleTime: 30000, // Data stays fresh for 30 seconds
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 60000, // Categories stay fresh for 1 minute
  });

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleCardHover = (id: number) => () => setHoveredId(id);
  const handleCardLeave = () => setHoveredId(null);

  const handleCardClick = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setActiveId(id);
      // Generate coordinates based on product ID for demo purposes
      const coords: [number, number] = [
        41.311151 + (product.id * 0.01),
        69.279737 + (product.id * 0.01)
      ];
      mapRef.current?.panTo(coords, { duration: 300 });
    }
  };

  const handlePlacemarkClick = (id: number) => {
    setActiveId(id);
    const product = products.find((p) => p.id === id);
    if (product) {
      const coords: [number, number] = [
        41.311151 + (product.id * 0.01),
        69.279737 + (product.id * 0.01)
      ];
      mapRef.current?.panTo(coords, { duration: 300 });
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    if (categoryId === selectedCategoryId) return; // Prevent unnecessary changes

    setIsCategoryChanging(true);
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset to first page when category changes

    // Reset loading state after a short delay
    setTimeout(() => {
      setIsCategoryChanging(false);
    }, 300);
  };

  const handlePageChange = (page: number) => {
    setIsPageChanging(true);
    setCurrentPage(page);
    // Scroll to top of product list when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset loading state after a short delay to show the transition
    setTimeout(() => {
      setIsPageChanging(false);
    }, 300);
  };

  // Show loading only for initial load, not for category changes
  if (isLoading && !products.length) return <DataLoader message="Mahsulotlar yuklanmoqda..." />

  return (
    <Container className="flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-[73px] pb-6">
        <h1 className="font-medium pb-10 text-4xl text-textColor">
          Suprise baglar
        </h1>

        {/* Category Tabs */}
        <div className="flex justify-between items-center">
          <CategoryTabs
            onCategoryChange={handleCategoryChange}
            selectedCategoryId={selectedCategoryId}
            categories={categories}
            isLoading={isLoading}
          />
          <div className="flex items-center gap-4">
            <SelectComponent value="Saralash turi">
              <SelectItem value="Saralash turi">Saralash turi</SelectItem>
            </SelectComponent>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-[10px] mb-[253px]">
        {/* Product List */}
        <div className="col-span-1" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col gap-[10px] pb-6 transition-all duration-300 ease-in-out">
            {isPageChanging || isCategoryChanging ? (
              // Loading state while page or category is changing
              <div className="flex items-center justify-center py-8 opacity-75 transition-opacity duration-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
              </div>
            ) : (
              <div className="transition-all duration-300 ease-in-out">
                {currentProducts.map((product) => (
                  <SurpriseBagCard
                    isLoading={isLoading}
                    key={product.id}
                    product={product}
                    highlighted={hoveredId === product.id || activeId === product.id}
                    active={activeId === product.id}
                    onHover={handleCardHover(product.id)}
                    onLeave={handleCardLeave}
                    onClick={() => handleCardClick(product.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-start">
              {/* Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className=""
              />
            </div>
          )}
        </div>

        {/* Right Panel - Map */}
        <div>
          <div className="sticky top-0">
            <YandexMap
              products={products}
              hoveredId={hoveredId}
              activeId={activeId}
              mapRef={mapRef}
              handlePlacemarkClick={handlePlacemarkClick}
              setActiveId={setActiveId}
              setHoveredId={setHoveredId}
            />

            {/* Map Controls Overlay */}
            <MapControls />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MapPage;