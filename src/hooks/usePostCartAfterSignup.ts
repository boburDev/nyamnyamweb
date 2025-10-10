import { useMutation } from "@tanstack/react-query";
import { CartItem } from "@/context/cartStore";

interface PostCartData {
  items: CartItem[];
}

const buildRequestBody = (cartItems: { id: string; quantity: number }[]) => {
  return {
    items: cartItems.map((item) => ({
      surprise_bag: item.id,
      quantity: item.quantity,
    })),
  };
};

const postCartAfterSignup = async (data: PostCartData) => {
  const body = buildRequestBody(data.items);

  const response = await fetch(`/api/cart/post-after-signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to post cart items");
  }

  return response.json();
};

export const usePostCartAfterSignup = () => {
  return useMutation({
    mutationFn: postCartAfterSignup,
  });
};
