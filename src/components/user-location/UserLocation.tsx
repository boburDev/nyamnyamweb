"use client";

import { useLocationService } from "@/hooks/useLocationService";

export default function UserLocation() {
  const { coords, permission: _permission, loading: _loading } = useLocationService();

  // This component is hidden but ensures location service is initialized
  // The useLocationService hook will automatically handle permission checking
  // and fetching location when permission is granted

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
