"use client";

import { useLocationService } from "@/hooks/useLocationService";

export default function UserLocation() {
  const { coords } = useLocationService();

  return (
    <div className="hidden">
      {coords && (
        <span>
          Lat: {coords.lat}, Lon: {coords.lon}
        </span>
      )}
    </div>
  );
}
