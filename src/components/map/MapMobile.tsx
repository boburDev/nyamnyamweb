/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { DataLoader } from "../loader";
import { Container } from "../container";
import { Pagination } from "../ui/pagination";
import { useGetSupriseBag } from "@/hooks/suprise-bag";
import { useLocale } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../card";
import { ProductData } from "@/types";

const YandexMap = dynamic(() => import("@/components/map/YandexMap"), {
    ssr: false,
});

const MapMobile = () => {
    const locale = useLocale();
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTab, _setActiveTab] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const mapRef = useRef<any>(null);
    // const [mapCenter, setMapCenter] = useState<[number, number]>([41.311151, 69.279737]);
    // const [mapZoom, setMapZoom] = useState<number>(12);
    // Mobile view mode: "map" or "card"
    const [mobileViewMode, setMobileViewMode] = useState<string>("map");

    const params = useSearchParams();
    const lat = parseFloat(params.get("lat") || "0");
    const lon = parseFloat(params.get("lon") || "0");

    useEffect(() => {
        if (lat && lon && mapRef.current) {
            mapRef.current.setCenter([lat, lon], 15, { duration: 600 });
        }
    }, [lat, lon]);

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
    const products: ProductData[] = React.useMemo(() => {
        if (!surpriseBagData) return [];

        const allProducts: ProductData[] = [];
        const productIds = new Set<string>();

        // Add popular products
        if (Array.isArray(surpriseBagData.popular)) {
            surpriseBagData.popular.forEach((product: ProductData) => {
                if (!productIds.has(product.id)) {
                    productIds.add(product.id);
                    allProducts.push(product);
                }
            });
        }

        // Add recommended products
        if (Array.isArray(surpriseBagData.recommended)) {
            surpriseBagData.recommended.forEach((product: ProductData) => {
                if (!productIds.has(product.id)) {
                    productIds.add(product.id);
                    allProducts.push(product);
                }
            });
        }

        // Add other category products
        Object.entries(surpriseBagData).forEach(([key, items]) => {
            if (key !== "popular" && key !== "recommended" && Array.isArray(items)) {
                items.forEach((product: ProductData) => {
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

    // const handleCardHover = (id: string) => () => setHoveredId(id);
    // const handleCardLeave = () => setHoveredId(null);
    // const handleCardClick = (id: string) => {
    //     const product = products.find((p) => p.id === id);
    //     if (product) {
    //         setActiveId(id);
    //         // If product has coords, pan to them
    //         if (product.lat && product.lon) {
    //             mapRef.current?.panTo([product.lat, product.lon], { duration: 300 });
    //         }
    //     }
    // };

    const handlePlacemarkClick = (id: string) => {
        setActiveId(id);
        const product = products.find((p) => p.id === id);
        if (product && product.lat && product.lon) {
            mapRef.current?.panTo([product.lat, product.lon], { duration: 300 });
        }
    };

    // const handleTabChange = (value: string) => {
    //     if (value === activeTab) return; 

    //     setActiveTab(value);
    //     setCurrentPage(1); 
    //     setActiveId(null); 
    //     setHoveredId(null); 
    // };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // const handleRefreshMap = () => {
    //     setMapCenter([41.311151, 69.279737]);
    //     setMapZoom(12);
    //     setActiveId(null);
    //     setHoveredId(null);
    //     if (mapRef.current) {
    //         mapRef.current.setCenter(mapCenter, mapZoom, { duration: 500 });
    //     }
    // };

    // Show loading only for initial load, not for category changes
    if (isLoading && !products.length)
        return <DataLoader message="Mahsulotlar yuklanmoqda..." />;

    // Calculate header height for map positioning
    const headerHeight = mobileViewMode === "map" ? "calc(100vh - 240px)" : "auto";

    return (
        <div className="md:hidden">
            <Container className="flex flex-col relative">
                {/* Header with Search - fixed at top */}
                <div className=" pt-10 z-50 relative">

                    {/* Mobile View Tabs (Map/Card) */}
                    <div className="pb-4">
                        <Tabs
                            value={mobileViewMode}
                            onValueChange={setMobileViewMode}
                        >
                            <TabsList className="bg-transparent flex gap-[15px] w-full justify-start p-0">
                                <TabsTrigger
                                    value="map"
                                    className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-12 capitalize flex-1"
                                >
                                    Xarita
                                </TabsTrigger>
                                <TabsTrigger
                                    value="card"
                                    className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-12 capitalize flex-1"
                                >
                                    Card
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Category Tabs */}
                    {/* <div className="pb-4">
                        <Tabs
                            defaultValue={activeTab}
                            value={activeTab}
                            onValueChange={handleTabChange}
                        >
                            <TabsList className="bg-transparent flex gap-[15px] overflow-x-auto">
                                <TabsTrigger
                                    key="all"
                                    value="all"
                                    className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-5 py-2 rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-10 capitalize whitespace-nowrap"
                                >
                                    Hamma
                                </TabsTrigger>
                                {category?.map((cat: CategoryData) => (
                                    <TabsTrigger
                                        key={cat.id}
                                        value={cat.slug}
                                        className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-5 py-2 rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-10 capitalize whitespace-nowrap"
                                    >
                                        {cat.title}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div> */}
                </div>

                {/* Main Content */}
                <div className="flex-1 relative">
                    {/* Map View - only show when map tab is active */}
                    {mobileViewMode === "map" && (
                        <div className="fixed inset-x-0 bottom-0 w-full z-30" style={{ top: '240px', height: headerHeight }}>
                            <YandexMap
                                products={products}
                                hoveredId={hoveredId}
                                activeId={activeId}
                                mapRef={mapRef}
                                handlePlacemarkClick={handlePlacemarkClick}
                                setHoveredId={setHoveredId}
                            />
                            {/* <MapControls onRefresh={handleRefreshMap} /> */}
                        </div>
                    )}

                    {/* Cards View - only show when card tab is active */}
                    {mobileViewMode === "card" && (
                        <div className="flex flex-col gap-[10px] pb-6" style={{ scrollbarWidth: "none" }}>
                            <div className="transition-all duration-300 ease-in-out flex flex-col gap-[10px]">
                                {currentProducts.map((product, index) => (
                                    <ProductCard
                                        key={`${activeTab}-${product.id}-${index}`}
                                        product={product}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-start">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default MapMobile;

