"use client";

import React from "react";
import { Heart } from "lucide-react";
import useFavouriteStore from "@/context/favouriteStore";
import { Product } from "@/api/product";
import { showToast } from "../toast/Toast";
import { useRouter } from "@/i18n/navigation";

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

    const handleFavourite = () => {
        // If already in favourites, redirect to favourites page
        if (isFavourite(product.id)) {
            router.push("/favourite");
            return;
        }

        // Add to favourites and show success message
        addToFavourites(product);
        showToast({
            title: "Saqlangan mahsulotlarga qo'shildi",
            type: "success",
            href: "/favourite",
            hrefName: "Saqlangan mahsulotlar",
        });
    };

    const isFavouriteState = isFavourite(product.id);

    return (
        <button
            onClick={handleFavourite}
            className={`
     
      `}
            // variant={variant}
           >
            <Heart
                className={`w-6 h-6 rounded-full `}
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
