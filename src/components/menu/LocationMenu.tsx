"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  CheckIcon,
  ChevronBottom,
  LocationIcon,
  PlusIcon,
} from "@/assets/icons";
import { locationData } from "@/data";
import { useState } from "react";
export const LocationMenu = () => {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="w-[170px] h-12 flex justify-start gap-[15px] font-medium text-sm focus-visible:ring-0"
        >
          <span>
            <LocationIcon />
          </span>
          <span className="overflow-hidden line-clamp-2 whitespace-pre-line">
            {selected ? selected : "Manzilni tanlash"}
          </span>
          <span>
            <ChevronBottom />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[273px] border-borderColor p-0">
        <DropdownMenuLabel className="p-0 pt-[10px] mb-[10px]">
          <Button
            variant={"link"}
            className="hover:no-underline  h-10 py-[13px] px-[10px]font-medium text-sm text-mainColor"
          >
            <span>
              <PlusIcon />
            </span>{" "}
            Yangi manzil kiritish
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locationData.map((item, index) => (
          <DropdownMenuItem
            onClick={() => setSelected(item)}
            key={index}
            className="bg-white cursor-pointer focus:bg-hoverColor items-center px-[10px] h-10 justify-between"
          >
            {item}
            {item === selected ? (
              <span>
                <CheckIcon />
              </span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationMenu;
