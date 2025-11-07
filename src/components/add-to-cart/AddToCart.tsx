"use client";

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
import { isProductInList } from "@/utils";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("cart");
  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated: isAuth } = useAuthStatus();

  const { mutate: addToCartApi } = useAddToCart();

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuth,
  });
  const cartList = isAuth ? cartData?.cart_items : items;
  const isAddedToCart = isProductInList(cartList, product);
  const handleAddToCart = () => {
    if (isAuth) {
      if (isAddedToCart) {
        router.push("/cart");
      } else {
        addToCartApi([{ id: product.id, quantity: 1 }], {
          onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
            showToast({
              title: `${product.title} ${t("added")}`,
              type: "success",
              href: "/cart",
              hrefName: t("go-to-cart"),
            });
          },
        });
      }
    } else {
      if (isAddedToCart) {
        router.push("/cart");
      } else {
        addToCart(product);
        showToast({
          title: t("added"),
          type: "success",
          href: "/cart",
          hrefName: t("go-to-cart"),
        });
      }
    }
  };

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
        flex items-center justify-center gap-2
        ${isAddedToCart
          ? "bg-mainColor text-white hover:bg-mainColor/90"
          : "bg-gray-100 !text-mainColor hover:bg-gray-200 hover:!text-white"
        }
        transition-colors duration-200
      `}
      variant={variant}
    >
      <ShoppingCart className={iconSizes[size]} />
      {showText && (
        <span className="ml-2">{isAddedToCart ? t("in-cart") : t("add-to-cart")}</span>
      )}
    </Button>
  );
};

export default AddToCart;
