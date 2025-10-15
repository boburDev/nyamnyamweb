import { useMutation } from "@tanstack/react-query";

interface PostFavouriteData {
  items: Array<
    string | number | { id?: string | number; surprise_bag?: string | number }
  >;
}

const buildFavouriteRequestBody = (
  favouriteItems: Array<
    string | number | { id?: string | number; surprise_bag?: string | number }
  >
) => {
  return {
    items: favouriteItems.map((item) => ({
      surprise_bag:
        typeof item === "string" || typeof item === "number"
          ? item
          : item.surprise_bag ?? item.id,
    })),
  };
};

const postFavouriteAfterSignup = async (data: PostFavouriteData) => {
  const body = buildFavouriteRequestBody(data.items);

  const response = await fetch(`/api/favourites/create-all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({} as { message?: string }));
    throw new Error(errorData.message || "Failed to post favourite items");
  }

  return response.json();
};

export const usePostFavouriteAfterSignup = () => {
  return useMutation({
    mutationFn: postFavouriteAfterSignup,
  });
};
