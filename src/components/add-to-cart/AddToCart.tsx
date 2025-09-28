"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import useCartStore from "@/context/cartStore";
import { Product } from "@/api/product";
import { showToast } from "../toast/Toast";
import { useRouter } from "@/i18n/navigation";

interface AddToCartProps {
    product: Product;
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "outline" | "ghost";
    showText?: boolean;
}

const AddToCart: React.FC<AddToCartProps> = ({
    product,
    className = "",
    size = "md",
    variant = "default",
    showText = false,
}) => {
    const { addToCart, isInCart } = useCartStore();
    const router = useRouter();

    const handleAddToCart = () => {
        // If already in cart, redirect to cart page
        if (isInCart(product.id)) {
            router.push("/cart");
            return;
        }

        // Add to cart and show success message
        addToCart(product);
        showToast({
            title: "Savatga qo'shildi",
            type: "success",
            href: "/cart",
            hrefName: "Savatga o'tish",
        });
    };

    const isInCartState = isInCart(product.id);

    const sizeClasses = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
    };

    const iconSizes = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    return (
        <Button
            onClick={handleAddToCart}
            className={`
        ${sizeClasses[size]}
        ${className}
        ${isInCartState
                    ? "bg-mainColor text-white hover:bg-mainColor/90"
                    : "bg-gray-100 !text-mainColor hover:bg-gray-200 hover:!text-white"
                }
        transition-colors duration-200
      `}
            variant={variant}
        >
            <ShoppingCart className={iconSizes[size]} />
            {showText && (
                <span className="ml-2">
                    {isInCartState ? "Savatda" : "Savatga"}
                </span>
            )}
        </Button>
    );
};

export default AddToCart;