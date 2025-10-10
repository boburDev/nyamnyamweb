"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import useCartStore from "@/context/cartStore";
import { showToast } from "../toast/Toast";
import { useRouter } from "@/i18n/navigation";
import { useAddToCart } from "@/hooks";
import { getCart } from "@/api";
import { ProductData } from "@/types";
import { useAuthStatus } from "@/hooks/auth-status";

interface AddToCartProps {
  product: ProductData;
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
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, isInCart } = useCartStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated: isAuth } = useAuthStatus();

  const { mutate: addToCartApi } = useAddToCart();

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuth,
  });

  const handleAddToCart = () => {
    const inLocalCart = isInCart(product.id);
    const inServerCart =
      isAuth &&
      cartData?.items?.some(
        (item: ProductData) =>
          String(item?.id ?? item?.id) === String(product.id)
      );

    if (inLocalCart || inServerCart) {
      router.push("/cart");
      return;
    }

    if (isAuth) {
      addToCartApi([{ id: product.id, quantity: 1 }], {
        onSuccess: async () => {
          // Optimistically mark as added so button becomes active immediately
          setJustAdded(true);
          await queryClient.invalidateQueries({ queryKey: ["cart"] });
          showToast({
            title: `${product.title} savatga qo'shildi`,
            type: "success",
            href: "/cart",
            hrefName: "Savatga o'tish",
          });
        },
      });
    } else {
      addToCart(product);
      setJustAdded(true);
      showToast({
        title: "Savatga qo'shildi",
        type: "success",
        href: "/cart",
        hrefName: "Savatga o'tish",
      });
    }
  };

  const isInCartState =
    justAdded ||
    isInCart(product.id) ||
    (isAuth &&
        cartData?.cart_items?.some(
        (item: ProductData) => String(item?.id) === String(product.id)
      ));

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
        <span className="ml-2">{isInCartState ? "Savatda" : "Savatga"}</span>
      )}
    </Button>
  );
};

export default AddToCart;
