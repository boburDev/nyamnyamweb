"use client";

import { Button } from "../ui/button";
import { LocationIcon } from "@/assets/icons";
import { useLocationService } from "@/hooks/useLocationService";

export const LocationMenu = () => {
  const { address, loading, permission, fetchLocation } = useLocationService();

  const handleLocationClick = () => {
    if (permission === 'denied') {
      // If permission was denied, try to request again
      fetchLocation();
    }
  };

  return (
    <Button
      variant="outline"
      className="w-[250px] h-12 flex flex-col items-start justify-center font-medium text-sm focus-visible:ring-0 px-3 py-2"
      onClick={handleLocationClick}
    >
      <div className="flex items-center gap-2">
        <LocationIcon />
        <span className="overflow-hidden text-left line-clamp-2">
          {loading
            ? "Yuklanmoqda..."
            : address
              ? address
              : permission === 'denied'
                ? "Joylashuvga ruxsat bering"
                : "Manzilni aniqlash"
          }
        </span>
      </div>
    </Button>
  );
};

export default LocationMenu;
