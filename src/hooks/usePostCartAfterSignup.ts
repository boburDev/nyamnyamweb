import { useMutation } from "@tanstack/react-query";
import { CartItem } from "@/context/cartStore";
import { buildRequestBody } from "@/api/product";
interface PostCartData {
    items: CartItem[];
}

const postCartAfterSignup = async (data: PostCartData) => {
    console.log("Frontend sending cart data:", buildRequestBody(data.items)); // Debug log
    const response = await fetch(`/api/cart/post-after-signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(buildRequestBody(data.items)),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post cart items");
    }

    return response.json();
};

export const usePostCartAfterSignup = () => {
    return useMutation({
        mutationFn: postCartAfterSignup,
    });
};
