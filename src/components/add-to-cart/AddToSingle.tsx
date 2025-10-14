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
}) => {
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
              title: `${product.title} savatga qo'shildi`,
              type: "success",
              href: "/cart",
              hrefName: "Savatga o'tish",
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
          title: "Savatga qo'shildi",
          type: "success",
          href: "/cart",
          hrefName: "Savatga o'tish",
        });
      }
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="!px-[25px] !py-[10px]"
      variant={variant}
    >
      <CartIcon />
      {isAddedToCart ? "Savatga o'tish" : "Savatga qo'shish"}
    </Button>
  );
};

export default AddToSingle;
