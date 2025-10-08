"use client";

import React from "react";
import { Heart } from "lucide-react";
import useFavouriteStore from "@/context/favouriteStore";
import { Product } from "@/api/product";
import { showToast } from "../toast/Toast";
import { useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/user";
import { useAddFavourites } from "@/hooks";
import { getFavourites } from "@/api/favourite";

interface FavouriteButtonProps {
    product: Product;
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "outline" | "ghost";
    showText?: boolean;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({
    product,
    showText = false,
}) => {
    const { addToFavourites, isFavourite } = useFavouriteStore();
    const router = useRouter();
    const { data: user } = useQuery({ queryKey: ["user"], queryFn: getUsers });
    const isAuth = Boolean(user);
    const { mutate: addFavouritesApi } = useAddFavourites();
    const { data: favData } = useQuery({
        queryKey: ["favourites"],
        queryFn: getFavourites,
        enabled: isAuth,
    });

    const handleFavourite = () => {
        // Check if item is in favourites (local store for guest, server for auth)
        const inLocalFav = isFavourite(product.id);
        const inServerFav = isAuth && favData?.data?.some((item: any) => String(item.id) === String(product.id) || String(item.surprise_bag) === String(product.id));
        
        if (inLocalFav || inServerFav) {
            router.push("/favourite");
            return;
        }

        if (isAuth) {
            // Add to favourites via API for authenticated users
            addFavouritesApi([product.id], {
                onSuccess: () => {
                    showToast({
                        title: "Saqlangan mahsulotlarga qo'shildi",
                        type: "success",
                        href: "/favourite",
                        hrefName: "Saqlangan mahsulotlar",
                    });
                },
            });
        } else {
            // Add to local store for guest users
            addToFavourites(product);
            showToast({
                title: "Saqlangan mahsulotlarga qo'shildi",
                type: "success",
                href: "/favourite",
                hrefName: "Saqlangan mahsulotlar",
            });
        }
    };

    const isFavouriteState = isFavourite(product.id) || (isAuth && favData?.data?.some((item: any) => String(item.id) === String(product.id) || String(item.surprise_bag) === String(product.id)));

    return (
        <button
            onClick={handleFavourite}
            className={`
                backdrop-blur-[45px] bg-mainColor/20 hover:!bg-mainColor/20 text-white w-[37px] h-[37px] flex items-center justify-center rounded-full
            
      `}
        // variant={variant}
        >
            <Heart
                className={`w-6 h-6 rounded-full ${isFavouriteState ? ' fill-white' : ''} `}
            />
            {showText && (
                <span className="ml-2">
                    {isFavouriteState ? "Saqlangan" : "Saqlash"}
                </span>
            )}
        </button>
    );
};

export default FavouriteButton;
