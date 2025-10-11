import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "@/lib";
import { ProductData } from "@/types";

interface FavouriteStore {
  items: ProductData[];
  initialized: boolean;

  addToFavourites: (product: ProductData) => void;
  removeFromFavourites: (productId: string) => void;
  toggleFavourite: (product: ProductData) => void;
  clearFavourites: () => void;
  isFavourite: (productId: string) => boolean;
  getFavouriteCount: () => number;
}

const useFavouriteStore = create<FavouriteStore>()(
  persist(
    (set, get) => ({
      items: [],
      initialized: false,

      addToFavourites: (product: ProductData) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (!existingItem) {
          set({
            items: [...items, { ...product }],
          });
        }
      },

      removeFromFavourites: (productId: string) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== productId),
        });
      },

      toggleFavourite: (product: ProductData) => {
        const { isFavourite } = get();

        if (isFavourite(product.id)) {
          get().removeFromFavourites(product.id);
        } else {
          get().addToFavourites(product);
        }
      },

      clearFavourites: () => {
        set({ items: [] });
        cookieStorage.removeItem("nyam-web-favourites");
      },

      isFavourite: (productId: string) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      getFavouriteCount: () => {
        const { items } = get();
        return items.length;
      },
    }),
    {
      name: "nyam-web-favourites",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

export default useFavouriteStore;
