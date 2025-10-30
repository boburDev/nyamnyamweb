'use client'
import { Button } from "../ui/button";
import { LocationIcon } from "@/assets/icons";
import { useLocationService } from "@/hooks/useLocationService";

export const LocationMenu = () => {
  const { address, loading, fetchLocation } = useLocationService();

  return (
    <Button
      className="w-[250px] h-12 flex flex-col items-start !bg-transparent lg:!bg-white hover:!bg-white lg:!border lg:border-borderColor justify-center font-medium text-sm focus-visible:ring-0 px-3 py-2"
      onClick={fetchLocation}
    >
      <div className="flex items-center gap-2">
        <LocationIcon className="text-mainColor lg:text-textColor" />
        <span className="overflow-hidden text-left line-clamp-2 text-mainColor lg:text-textColor">
          {loading ? "Yuklanmoqda..." : address || "Ko'cha nomini aniqlash"}
        </span>
      </div>
    </Button>
  );
};
