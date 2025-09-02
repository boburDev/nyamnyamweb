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

// Dynamically import the map component to avoid SSR issues
const YandexMap = dynamic(() => import('@/components/map/YandexMap'), {
  ssr: false,
});

const MapPage = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const mapRef = useRef<any>(null);

  // Fetch products and categories
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => getProducts(selectedCategoryId),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

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
    setSelectedCategoryId(categoryId);
  };

  if (isLoading) return <DataLoader message="Mahsulotlar yuklanmoqda..." />

  return (
    <Container className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0 pt-[73px] pb-6">
        <h1 className="font-medium pb-10 text-4xl text-textColor">
          Suprise baglar
        </h1>

        {/* Category Tabs */}
        <div className="flex justify-between">
          <CategoryTabs
            onCategoryChange={handleCategoryChange}
            selectedCategoryId={selectedCategoryId}
          />
          <SelectComponent value="Saralash turi">
            <SelectItem value="Saralash turi">Saralash turi</SelectItem>
          </SelectComponent>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-[10px] min-h-0">
        {/* Product List */}
        <div className="col-span-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col gap-[10px] pb-6">
            {products.map((product) => (
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
        </div>

        {/* Right Panel - Map */}
        <div className="relative">
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
    </Container>
  );
};

export default MapPage;