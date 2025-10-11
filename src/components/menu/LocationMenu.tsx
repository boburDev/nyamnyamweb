"use client";
import { Button } from "../ui/button";
import { LocationIcon } from "@/assets/icons";
import { useEffect, useState } from "react";

export const LocationMenu = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🗺️ Foydalanuvchi joylashuvini olish
  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) return;

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // 🧭 Reverse geocoding — koordinatadan manzil olish
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();

            const city =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.village ||
              data?.address?.state ||
              "Noma’lum joy";

            setSelected(city);
          } catch (error) {
            console.error("Manzilni aniqlashda xatolik:", error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.warn("Joylashuvni olishda xatolik:", error);
          setLoading(false);
        }
      );
    };

    fetchLocation();
  }, []);

  return (
  
        <Button
          variant={"outline"}
          className="w-[170px] h-12 flex justify-start gap-[15px] font-medium text-sm focus-visible:ring-0"
        >
          <span>
            <LocationIcon />
          </span>
          <span className="overflow-hidden line-clamp-2 whitespace-pre-line">
            {loading
              ? "Yuklanmoqda..."
              : selected
              ? selected
              : "Manzilni tanlash"}
          </span>
        </Button>
     
  );
};

export default LocationMenu;
