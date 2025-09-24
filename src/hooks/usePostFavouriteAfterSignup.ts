import { useMutation } from "@tanstack/react-query";

interface PostFavouriteData {
    // Accept array of ids or product-like objects
    items: Array<string | number | { id?: string | number; surprise_bag?: string | number }>;
}

const postFavouriteAfterSignup = async (data: PostFavouriteData) => {
    const requestItems = (data.items || []).map((item) =>
        typeof item === "string" || typeof item === "number" ? { surprise_bag: item } : { surprise_bag: item.surprise_bag ?? item.id }
    );

    const response = await fetch(`/api/favourite/post-after-signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: requestItems }),
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


