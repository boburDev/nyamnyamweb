"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import useCartStore from "@/context/cartStore";
import { showToast } from "../toast/Toast";
import { useRouter } from "@/i18n/navigation";
import { useAddToCart } from "@/hooks";
import { getCart } from "@/api";
import { ProductData } from "@/types";
import { useAuthStatus } from "@/hooks/auth-status";
import { CartIcon } from "@/assets/icons";
import { isProductInList } from "@/utils";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AddToCartProps {
  product: ProductData;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
}

const AddToSingle: React.FC<AddToCartProps> = ({
  product,
  variant = "default",
  className,
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

  return (
    <Button
      onClick={handleAddToCart}
      className={cn("h-10.5 w-[182px] xl:w-[220px] xl:h-11", className ?? "")}
      variant={variant}
    >
      <CartIcon />
      {isAddedToCart ? t("go-to-cart") : t("add-to-cart")}
    </Button>
  );
};

export default AddToSingle;
