"use client";
import { Button } from "../ui/button";
import { LocationIcon } from "@/assets/icons";
import { useEffect, useState } from "react";

export const LocationMenu = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) return;

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // 🧭 Reverse geocoding
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();

            const address = data?.address || {};

            // 🔹 Shahar nomi
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              address.state ||
              "";

            // 🔹 Ko‘cha nomi
            const street =
              address.road ||
              address.neighbourhood ||
              address.suburb ||
              address.quarter ||
              "";

            // 🔹 Birlashtirilgan manzil
            const locationText = [street, city].filter(Boolean).join(", ");

            setSelected(locationText || "Manzil topilmadi");
          } catch (error) {
            console.error("Manzilni aniqlashda xatolik:", error);
            setSelected("Manzil topilmadi");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.warn("Joylashuvni olishda xatolik:", error);
          setSelected("Joylashuvni olishga ruxsat berilmadi");
          setLoading(false);
        }
      );
    };

    fetchLocation();
  }, []);

  return (
    <Button
      variant={"outline"}
      className="w-[200px] h-12 flex justify-start gap-[12px] font-medium text-sm focus-visible:ring-0"
    >
      <span>
        <LocationIcon />
      </span>
      <span className="overflow-hidden text-left line-clamp-2">
        {loading
          ? "Yuklanmoqda..."
          : selected
          ? selected
          : "Manzilni aniqlash"}
      </span>
    </Button>
  );
};

export default LocationMenu;
