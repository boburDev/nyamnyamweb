"use client";

import { Button } from "../ui/button";
import { LocationIcon } from "@/assets/icons";
import { useLocationStore } from "@/context/userStore";
import { useEffect } from "react";

export const LocationMenu = () => {
  const { address, loading, setCoords, setAddress, setLoading } =
    useLocationStore();

  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) return;

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          setCoords({ lat: latitude, lon: longitude });

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const addressData = data?.address || {};

            const city =
              addressData.city ||
              addressData.town ||
              addressData.village ||
              addressData.county ||
              addressData.state ||
              "";

            const street =
              addressData.road ||
              addressData.neighbourhood ||
              addressData.suburb ||
              addressData.quarter ||
              "";

            const locationText = [street, city].filter(Boolean).join(", ");
            setAddress(locationText || "Manzil topilmadi");
          } catch (error) {
            console.error("Manzilni aniqlashda xatolik:", error);
            setAddress("Manzil topilmadi");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.warn("Joylashuvni olishda xatolik:", error);
          setAddress("Joylashuvni olishga ruxsat berilmadi");
          setLoading(false);
        }
      );
    };

    fetchLocation();
  }, [setCoords, setAddress, setLoading]);

  return (
    <Button
      variant="outline"
      className="w-[250px] h-12 flex flex-col items-start justify-center font-medium text-sm focus-visible:ring-0 px-3 py-2"
    >
      <div className="flex items-center gap-2">
        <LocationIcon />
        <span className="overflow-hidden text-left line-clamp-2">
          {loading ? "Yuklanmoqda..." : address ? address : "Manzilni aniqlash"}
        </span>
      </div>
    </Button>
  );
};

export default LocationMenu;
