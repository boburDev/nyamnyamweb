"use client";

import { ExternalLink, X } from "lucide-react";

type MapCoords = { lat: number; lon: number };

type MapOptionsSheetProps = {
  isOpen: boolean;
  mapCoords: MapCoords | null;
  title: string;
  onClose: () => void;
};

// ilova deep link bilan web fallback funksiyasi
const openAppWithWebFallback = (appUrl: string, webUrl: string) => {
  let fallbackTimer: number | null = null;
  let hidden = false;

  const handleVisibility = () => {
    if (document.visibilityState === "hidden") {
      hidden = true;
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  try {
    window.location.href = appUrl;
  } catch (_e) {
    // ba’zi browserlarda bu ishlamaydi, fallback timer baribir ishga tushadi
  }

  fallbackTimer = window.setTimeout(() => {
    if (!hidden) {
      window.open(webUrl, "_blank");
    }
    document.removeEventListener("visibilitychange", handleVisibility);
  }, 700);

  // xavfsizlik uchun 2 sekunddan so‘ng listenerni olib tashlash
  window.setTimeout(() => {
    if (fallbackTimer) clearTimeout(fallbackTimer);
    document.removeEventListener("visibilitychange", handleVisibility);
  }, 2000);
};

// Map provayderlar (deep link + web fallback)
const mapProviders = [
  {
    label: "Yandex Maps",
    appUrl: (coords: MapCoords) =>
      `yandexmaps://maps.yandex.com/?rtext=~${coords.lat}%2C${coords.lon}&rtt=auto`,
    webUrl: (coords: MapCoords) =>
      `https://yandex.uz/maps/?from=api-maps&mode=routes&rtext=~${coords.lat}%2C${coords.lon}&rtt=auto&z=15`,
  },
  {
    label: "Google Maps",
    appUrl: (coords: MapCoords) =>
      `comgooglemaps://?daddr=${coords.lat},${coords.lon}&directionsmode=driving`,
    webUrl: (coords: MapCoords) =>
      `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lon}&travelmode=driving`,
  },
  {
    label: "Apple Maps",
    appUrl: (coords: MapCoords) =>
      `maps://?daddr=${coords.lat},${coords.lon}&saddr=Current%20Location`,
    webUrl: (coords: MapCoords) =>
      `https://maps.apple.com/?daddr=${coords.lat},${coords.lon}&saddr=Current%20Location`,
  },
  {
    label: "Device default",
    appUrl: (coords: MapCoords) => `geo:${coords.lat},${coords.lon}?q=${coords.lat},${coords.lon}`,
    webUrl: (coords: MapCoords) =>
      `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lon}`,
  },
] as const;

export const MapOptionsSheet = ({
  isOpen,
  mapCoords,
  title,
  onClose,
}: MapOptionsSheetProps) => {
  if (!isOpen || !mapCoords) return null;

  const handleSelect = (appUrl: string, webUrl: string) => {
    openAppWithWebFallback(appUrl, webUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-semibold text-textColor">{title}</p>
          <button onClick={onClose} aria-label="Close map options" className="text-dolphin">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {mapProviders.map(({ label, appUrl, webUrl }) => (
            <button
              key={label}
              className="flex items-center justify-between rounded-xl border border-plasterColor px-4 py-3 text-left"
              onClick={() => handleSelect(appUrl(mapCoords), webUrl(mapCoords))}
            >
              <span className="font-medium text-textColor">{label}</span>
              <ExternalLink className="size-4 text-dolphin" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapOptionsSheet;
