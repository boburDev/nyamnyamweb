import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "@/lib";
import { Product } from "@/api/product";
import { getAllProducts } from "@/data/product-data";

interface FavouriteStore {
    items: Product[];
    initialized: boolean;

    // Actions
    addToFavourites: (product: Product) => void;
    removeFromFavourites: (productId: number) => void;
    toggleFavourite: (product: Product) => void;
    clearFavourites: () => void;
    isFavourite: (productId: number) => boolean;
    getFavouriteCount: () => number;
    initializeFavourites: () => void;
}

const useFavouriteStore = create<FavouriteStore>()(
    persist(
        (set, get) => ({
            items: [],
            initialized: false,

            addToFavourites: (product: Product) => {
                const { items } = get();
                const existingItem = items.find(item => item.id === product.id);

                if (!existingItem) {
                    set({
                        items: [...items, { ...product, isBookmarked: true }]
                    });
                }
            },

            removeFromFavourites: (productId: number) => {
                const { items } = get();
                set({
                    items: items.filter(item => item.id !== productId)
                });
            },

            toggleFavourite: (product: Product) => {
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

            isFavourite: (productId: number) => {
                const { items } = get();
                return items.some(item => item.id === productId);
            },

            getFavouriteCount: () => {
                const { items } = get();
                return items.length;
            },

            initializeFavourites: () => {
                const { initialized } = get();
                if (!initialized) {
                    const allProducts = getAllProducts();
                    const bookmarkedProducts = allProducts.filter(product => product.isBookmarked);

                    set({
                        items: bookmarkedProducts,
                        initialized: true
                    });
                }
            },
        }),
        {
            name: "nyam-web-favourites",
            storage: createJSONStorage(() => cookieStorage),
        }
    )
);

export default useFavouriteStore;
