"use client";

import { useEffect, useState } from "react";

export default function UserLocation() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation browser tomonidan qo‘llab-quvvatlanmaydi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        console.log("📍 Foydalanuvchi joylashuvi:", latitude, longitude);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Foydalanuvchi joylashuvga ruxsat bermadi.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Joylashuv ma’lumotlari mavjud emas.");
            break;
          case err.TIMEOUT:
            setError("Joylashuv so‘rovi vaqt tugadi.");
            break;
          default:
            setError("Noma’lum xatolik yuz berdi.");
        }
      }
    );
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-sm p-2">
        {error}
      </div>
    );
  }

  return (
    <div className="hidden">
      {location && (
        <span>
          Lat: {location.lat}, Lon: {location.lon}
        </span>
      )}
    </div>
  );
}
