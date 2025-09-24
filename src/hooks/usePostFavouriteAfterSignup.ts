import { useMutation } from "@tanstack/react-query";
import { buildFavouriteRequestBody } from "@/api/product";

interface PostFavouriteData {
    // Accept array of ids or product-like objects
    items: Array<string | number | { id?: string | number; surprise_bag?: string | number }>;
}

const postFavouriteAfterSignup = async (data: PostFavouriteData) => {
    console.log("Frontend sending favourite data:", buildFavouriteRequestBody(data.items)); // Debug log
    const response = await fetch(`/api/favourite/post-favorite-after-signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(buildFavouriteRequestBody(data.items)),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to post favourite items");
    }

    return response.json();
};

export const usePostFavouriteAfterSignup = () => {
    return useMutation({
        mutationFn: postFavouriteAfterSignup,
    });
};


