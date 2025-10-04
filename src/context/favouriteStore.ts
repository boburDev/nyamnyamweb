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
    removeFromFavourites: (productId: string) => void;
    toggleFavourite: (product: Product) => void;
    clearFavourites: () => void;
    isFavourite: (productId: string) => boolean;
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

            removeFromFavourites: (productId: string) => {
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

            isFavourite: (productId: string) => {
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
                    // Map legacy products to the canonical Product shape
                    (async () => {
                        const mod = await import("@/api/product");
                        type LegacyProduct = {
                            id: string;
                        };
                        const bookmarkedProducts = allProducts.map((p) => mod.mapLegacyProductToProduct(p as unknown as LegacyProduct));
                        set({ items: bookmarkedProducts, initialized: true });
                    })();
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
