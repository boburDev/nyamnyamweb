/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { DataLoader } from "../loader";
import { Container } from "../container";
import SelectComponent from "../select/Select";
import { SelectItem } from "../ui/select";
import { SurpriseBagCard } from "../surprise-bag/SurpriseBagCard";
import { Pagination } from "../ui/pagination";
import { MapControls } from "./MapControls";
import { useGetCategory } from "@/hooks";
import { useGetSupriseBag } from "@/hooks/suprise-bag";
import { useLocale } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryData } from "@/types";
import { Product } from "@/api/product";

const YandexMap = dynamic(() => import("@/components/map/YandexMap"), {
  ssr: false,
});

const MapClient = () => {
  const locale = useLocale()
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const mapRef = useRef<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.311151, 69.279737]);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const { data: category } = useGetCategory(locale);

  // 🧭 User location
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // 📍 Get or load location
  useEffect(() => {
    const savedLocation = localStorage.getItem("user_location");
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lon: longitude };
          setUserLocation(location);
          localStorage.setItem("user_location", JSON.stringify(location));
        },
        (error) => {
          console.warn("Location permission denied:", error.message);
        }
      );
    }
  }, []);

  // 🧾 Fetch SurpriseBags (location bilan)
  const { data: surpriseBagData, isLoading } = useGetSupriseBag({
    locale,
    slug: activeTab,
    lat: userLocation?.lat,
    lon: userLocation?.lon,
  });
  // Flatten all products from different sections into a single array with unique products
  const products: Product[] = React.useMemo(() => {
    if (!surpriseBagData) return [];

    const allProducts: Product[] = [];
    const productIds = new Set<string>();

    // Add popular products
    if (Array.isArray(surpriseBagData.popular)) {
      surpriseBagData.popular.forEach((product: Product) => {
        if (!productIds.has(product.id)) {
          productIds.add(product.id);
          allProducts.push(product);
        }
      });
    }

    // Add recommended products
    if (Array.isArray(surpriseBagData.recommended)) {
      surpriseBagData.recommended.forEach((product: Product) => {
        if (!productIds.has(product.id)) {
          productIds.add(product.id);
          allProducts.push(product);
        }
      });
    }

    // Add other category products
    Object.entries(surpriseBagData).forEach(([key, items]) => {
      if (key !== "popular" && key !== "recommended" && Array.isArray(items)) {
        items.forEach((product: Product) => {
          if (!productIds.has(product.id)) {
            productIds.add(product.id);
            allProducts.push(product);
          }
        });
      }
    });

    return allProducts;
  }, [surpriseBagData]);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleCardHover = (id: string) => () => setHoveredId(id);
  const handleCardLeave = () => setHoveredId(null);
  const handleCardClick = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setActiveId(id);
      // If product has coords, pan to them
      if (product.coords && product.coords.length === 2) {
        mapRef.current?.panTo(product.coords as [number, number], { duration: 300 });
      }
    }
  };

  const handlePlacemarkClick = (id: string) => {
    setActiveId(id);
    const product = products.find((p) => p.id === id);
    if (product && product.coords && product.coords.length === 2) {
      mapRef.current?.panTo(product.coords as [number, number], { duration: 300 });
    }
  };

  const handleTabChange = (value: string) => {
    if (value === activeTab) return; // Prevent unnecessary changes

    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when tab changes
    setActiveId(null); // Reset active product when tab changes
    setHoveredId(null); // Reset hovered product when tab changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of product list when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefreshMap = () => {
    setMapCenter([41.311151, 69.279737]);
    setMapZoom(12);
    setActiveId(null);
    setHoveredId(null);
    if (mapRef.current) {
      mapRef.current.setCenter(mapCenter, mapZoom, { duration: 500 });
    }
  };


  // Show loading only for initial load, not for category changes
  if (isLoading && !products.length)
    return <DataLoader message="Mahsulotlar yuklanmoqda..." />;
  return (
    <Container className="flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-[73px] pb-6">
        <h1 className="font-medium pb-10 text-4xl text-textColor">
          Suprise baglar
        </h1>

        {/* Category Tabs */}
        <div className="flex justify-between items-center">
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={handleTabChange}
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
                  value={cat.slug}
                  className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-12 capitalize"
                >
                  {cat.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-4">
            <SelectComponent value="Saralash turi">
              <SelectItem value="Saralash turi">Saralash turi</SelectItem>
            </SelectComponent>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-[10px]">
        {/* Product List */}
        <div className="col-span-1" style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-col gap-[10px] pb-6">
            {/* Products Section - Only this part refreshes when category changes */}
            <div className="transition-all duration-300 ease-in-out flex flex-col gap-[10px]">
              {currentProducts.map((product, index) => (
                <SurpriseBagCard
                  isLoading={isLoading}
                  key={`${activeTab}-${product.id}-${index}`}
                  product={product}
                  highlighted={
                    hoveredId === product.id || activeId === product.id
                  }
                  active={activeId === product.id}
                  onHover={handleCardHover(product.id)}
                  onLeave={handleCardLeave}
                  onClick={() => handleCardClick(product.id)}
                />
              ))}
            </div>
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
            <MapControls onRefresh={handleRefreshMap} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MapClient;
