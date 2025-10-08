import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "@/lib";
import { CartData } from "@/types";

interface FavouriteStore {
  items: CartData[];
  initialized: boolean;

  addToFavourites: (product: CartData) => void;
  removeFromFavourites: (productId: string) => void;
  toggleFavourite: (product: CartData) => void;
  clearFavourites: () => void;
  isFavourite: (productId: string) => boolean;
  getFavouriteCount: () => number;
}

const useFavouriteStore = create<FavouriteStore>()(
  persist(
    (set, get) => ({
      items: [],
      initialized: false,

      addToFavourites: (product: CartData) => {
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

      toggleFavourite: (product: CartData) => {
        const { isFavourite } = get();

        if (isFavourite(product.id)) {
          get().removeFromFavourites(product.id);
        } else {
          get().addToFavourites(product);
        }
      },

      clearFavourites: () => {
        set({ items: [] });
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
