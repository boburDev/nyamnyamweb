/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Product } from "@/api/product";
import {
  YMaps,
  Map,
  Placemark,
  ZoomControl,
  GeolocationControl,
} from "@pbe/react-yandex-maps";
import React, { useEffect, useState, useMemo, memo } from "react";
import MemoizedPlacemark from "./YPlace";

interface YandexMapProps {
  products: Product[];
  hoveredId: number | null;
  activeId: number | null;
  mapRef: React.RefObject<any>;
  handlePlacemarkClick: (id: number) => void;
  setActiveId?: (id: number | null) => void;
  setHoveredId?: (id: number | null) => void;
}

export const createCustomMarkerSVG = (
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
  const originalPrice = parseFloat(product.originalPrice.replace(/[^\d]/g, ""));
  const currentPrice = parseFloat(product.currentPrice.replace(/[^\d]/g, ""));
  const discountPercent = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );
  const formattedDiscount = `-${discountPercent}%`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <g>
        <rect x="0" y="0" width="30" height="24" fill="${topBgColor}" filter="url(#shadow)" />
        <rect x="0" y="23" width="30" height="18" fill="${bottomBgColor}" filter="url(#shadow)" />
      </g>
      <text x="15" y="13" font-family="Arial" font-size="8px" font-weight="bold" fill="${textColor}" text-anchor="middle">
        ${formattedRating}
      </text>
      <text x="15" y="33" font-family="Arial" font-size="6px" fill="#fff" text-anchor="middle">
        ${formattedDiscount}
      </text>
    </svg>
  `)}`;
};



const YandexMap = ({
  products,
  hoveredId,
  activeId,
  mapRef,
  handlePlacemarkClick,
  setActiveId,
  setHoveredId,
}: YandexMapProps) => {
  const uzbekistanBounds: [[number, number], [number, number]] = [
    [37.0, 55.0],
    [46.0, 73.0],
  ];

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  // 📍 Detect user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.log(err)
      );
    }
  }, []);

  // 🔎 Zoom when activeId changes
  useEffect(() => {
    if (activeId && mapRef.current) {
      const product = products.find((p) => p.id === activeId);
      if (product) {
        mapRef.current.setCenter(product.coords, 14, { duration: 500 });
      }
    }
  }, [activeId, products, mapRef]);

  return (
    <div className="w-full h-screen">
      <YMaps
        query={{
          apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "",
          load: "package.standard",
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

          {products.map((p) => (
            <MemoizedPlacemark
              key={p.id}
              product={p}
              isHighlighted={hoveredId === p.id}
              isActive={activeId === p.id}
              setHoveredId={setHoveredId}
              handlePlacemarkClick={handlePlacemarkClick}
            />
          ))}

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
