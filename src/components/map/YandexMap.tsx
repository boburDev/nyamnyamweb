"use client";

import { Product } from "@/api/product";
import {
  YMaps,
  Map,
  Placemark,
  ZoomControl,
  GeolocationControl,
} from "@pbe/react-yandex-maps";
import { useEffect, useState, useCallback, useMemo } from "react";

interface YandexMapProps {
  products: Product[];
  hoveredId: number | null;
  activeId: number | null;
  mapRef: React.RefObject<any>;
  handlePlacemarkClick: (id: number) => void;
  setActiveId?: (id: number | null) => void;
  setHoveredId?: (id: number | null) => void;
}

const YandexMap = ({
  products,
  hoveredId,
  activeId,
  mapRef,
  handlePlacemarkClick,
  setActiveId,
  setHoveredId,
}: YandexMapProps) => {
  const uzbekistanBounds = [
    [37.0, 55.0],
    [46.0, 73.0],
  ];

  // Detect user location
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  // Zoom to product location when activeId changes
  useEffect(() => {
    if (activeId && mapRef.current) {
      const product = products.find(p => p.id === activeId);
      if (product) {
        mapRef.current.setCenter(product.coords, 14, { duration: 500 });
      }
    }
  }, [activeId, products, mapRef]);

  // Memoize the custom marker SVG creation to prevent unnecessary re-renders
  const createCustomMarkerSVG = useCallback((
    product: Product,
    isHighlighted: boolean,
    isActive: boolean
  ) => {
    let topBgColor = "#fff";
    let bottomBgColor = "#000";
    let textColor = "#000";

    if (isActive) {
      topBgColor = "#047857";
      bottomBgColor = "#000";
      textColor = "#fff";
    } else if (isHighlighted) {
      topBgColor = "#10b981";
      bottomBgColor = "#000";
      textColor = "#fff";
    }

    const formattedRating = product.rating.toFixed(1);
    // Calculate discount percentage from original and current price
    const originalPrice = parseFloat(product.originalPrice.replace(/[^\d]/g, ''));
    const currentPrice = parseFloat(product.currentPrice.replace(/[^\d]/g, ''));
    const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    const formattedDiscount = `-${discountPercent}%`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg width="30" height="45" viewBox="0 0 30 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.4)"/>
        </filter>
        
        <style>
          // .pulse-animation {
          //   animation: pulse 1.5s ease-in-out infinite;
          // }
          // .active-animation {
          //   animation: active-pulse 2s ease-in-out infinite;
          // }
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes active-pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
        </style>
      </defs>
      
      <g class="${isActive ? "active-animation" : isHighlighted ? "pulse-animation" : ""}">
        <rect x="0" y="0" width="30" height="24" fill="${topBgColor}" filter="url(#shadow)" 
              stroke-width="${isActive || isHighlighted ? "1" : "0"}"/>
        <rect x="0" y="23" width="30" height="18" fill="${bottomBgColor}" filter="url(#shadow)"
              stroke-width="${isActive || isHighlighted ? "1" : "0"}"/>
      </g>
      
      <text x="15" y="13" 
            font-family="Arial, sans-serif" font-size="8px" font-weight="bold" 
            fill="${textColor}" text-anchor="middle" alignment-baseline="middle">
        ${formattedRating}
      </text>
      
      <text x="15" y="33" 
            font-family="Arial, sans-serif" font-size="6px" font-weight="normal"
            fill="#fff" text-anchor="middle" alignment-baseline="middle">
        ${formattedDiscount}
      </text>
    </svg>
  `)}`;
  }, []);

  // Memoize placemarks to prevent unnecessary re-renders
  const placemarks = useMemo(() => {
    return products.map((product) => {
      const isHighlighted = hoveredId === product.id;
      const isActive = activeId === product.id;

      return (
        <Placemark
          key={product.id}
          onMouseEnter={() => setHoveredId?.(product.id)}
          onMouseLeave={() => setHoveredId?.(null)}
          geometry={product.coords}
          options={{
            iconLayout: "default#image",
            iconImageHref: createCustomMarkerSVG(product, isHighlighted, isActive),
            iconImageSize: [120, 80],
            iconImageOffset: [-60, -80],
            openBalloonOnClick: true,
            balloonOffset: [0, -20],
            balloonPanelMaxMapArea: 0,
            zIndexHover: isActive ? 3000 : isHighlighted ? 2000 : 1000,
          }}
          properties={{
            hintContent: product.name,
            balloonContentBody: `
              <div style="width:360px; padding:;">
              <div style="display:flex;gap:12px; align-items:center;">
                <img src="${product.image || "/placeholder.svg"}" style="width:108px;height:107px;object-fit:cover;border-radius:8px;"/>
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;">
                    <h3 style="font-weight:500;font-size:20px; color:#2F2F2F;margin:0;">${product.name}</h3>
                    <span style="color:#6A6E78;font-size:14px;">⭐ ${product.rating}</span>
                  </div>
                  <p style="margin:4px 0; color:#6A6E78;font-size:14px;"> ${product.restaurant} • ${product.distance} km</p>
                  <div style="display:flex;align-items:center;gap:8px;margin-top:15px;">
                    <span style="text-decoration:line-through;color:#9CA3AF;font-size:14px;">${product.originalPrice}</span>
                    <span style="font-weight:600;color:#4FB477;font-size:18px;">${product.currentPrice}</span>
                  </div>
                 
                </div>
              </div>
            </div>
            `,
          }}
          onClick={() => handlePlacemarkClick(product.id)}
        />
      );
    });
  }, [products, hoveredId, activeId, createCustomMarkerSVG, handlePlacemarkClick, setHoveredId]);

  return (
    <div className="w-full h-screen">
      <YMaps
        query={{
          apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "",
          load: "package.standard,",
        }}
      >
        <Map
          defaultState={{
            center: [41.311151, 69.279737],
            zoom: 12,
            controls: [],
          }}
          width="100%"
          height="100%"
          instanceRef={(map) => {
            if (map) {
              mapRef.current = map;
              map.behaviors.disable("scrollZoom");
            }
          }}
          options={{
            suppressMapOpenBlock: true,
            suppressObsoleteBrowserNotifier: true,
            restrictMapArea: uzbekistanBounds,
            minZoom: 8,
          }}
        >
          <ZoomControl
            options={{ position: { top: 10, right: 10 }, size: "small" }}
          />
          <GeolocationControl
            options={{
              position: { right: 10, top: 90 },
            }}
          />
          {placemarks}
          {/* Add user location marker if available */}
          {userLocation && (
            <Placemark
              geometry={userLocation}
              options={{
                preset: "islands#blueCircleDotIcon",
                iconColor: "#1e88e5",
              }}
              properties={{
                hintContent: "Sizning joylashuvingiz",
                balloonContent: "Hozir bu yerdasiz",
              }}
            />
          )}
        </Map>
      </YMaps>
    </div>
  );
};

export default YandexMap;
