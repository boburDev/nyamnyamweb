"use client";
import { Map } from "lucide-react";
import { ProductData } from "@/types";
import { useRouter } from "@/i18n/navigation";

export const NavigateToMapBtn = ({ product }: { product: ProductData }) => {
    const router = useRouter();
    return (
        <button
            className="ml-[10px] text-mainColor text-[17px] font-normal flex gap-[10px] items-center mb-5"
            onClick={() => {
                router.push(`/map?lat=${product.lat}&lon=${product.lon}&id=${product.id}`);
            }}
        >
            <Map className="w-5 h-5 text-mainColor" />
            Xaritada ko’rish
        </button>
    )
}

export default NavigateToMapBtn;
