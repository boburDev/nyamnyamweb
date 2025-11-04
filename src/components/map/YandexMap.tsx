/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  YMaps,
  Map,
  Placemark,
  ZoomControl,
  GeolocationControl,
} from "@pbe/react-yandex-maps";
import React, { useEffect, useState } from "react";
import MemoizedPlacemark from "./YPlace";
import { ProductData } from "@/types";

interface YandexMapProps {
  products: ProductData[];
  hoveredId: string | null;
  activeId: string | null;
  mapRef: React.RefObject<any>;
  handlePlacemarkClick: (id: string) => void;
  setActiveId?: (id: string | null) => void;
  setHoveredId?: (id: string | null) => void;
  zoom?: boolean
}

const YandexMap = ({
  products,
  hoveredId,
  activeId,
  mapRef,
  handlePlacemarkClick,
  setHoveredId,
  zoom
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
      if (product && product.lat && product.lon) {
        mapRef.current.setCenter([product.lat, product.lon], 14, { duration: 500 });
      }
    }
  }, [activeId, products, mapRef]);

  return (
    <div className="w-full h-dvh md:h-[50vh] lg:h-screen">
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
          {!zoom && <ZoomControl
            options={{ position: { top: 10, right: 10 }, size: "small" }}
          />}
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
