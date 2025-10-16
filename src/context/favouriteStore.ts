import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProductData } from "@/types";

interface FavouriteStore {
  items: ProductData[];
  initialized: boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
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
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
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
        localStorage.removeItem("nyam-web-favourites");
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
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useFavouriteStore;
