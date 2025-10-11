import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "@/lib";
import { ProductData } from "@/types";

export interface CartItem extends ProductData {
  id: string;
  quantity: number;
  surprise_bag?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addToCart: (product: ProductData) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
  getTotalItems: () => number;
  getUniqueItemsCount: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (product: ProductData) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // Check if we can add more items based on stock
          if (product.count && existingItem.quantity >= product.count) {
            return; // Don't add more if stock limit reached
          }
          // If item exists, increase quantity
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Add new item with quantity 1
          set({
            items: [...items, { ...product, quantity: 1 }],
          });
        }
      },

      removeFromCart: (productId: string) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const { items } = get();
        const item = items.find((item) => item.id === productId);

        // Check stock limit if product has stock information
        if (item && item.count && quantity > item.count) {
          return; // Don't update if quantity exceeds stock
        }

        set({
          items: items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      clearCart: () => {
        set({ items: [] });
        cookieStorage.removeItem("nyam-web-cart");
      },

      isInCart: (productId: string) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      getCartItem: (productId: string) => {
        const { items } = get();
        return items.find((item) => item.id === productId);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getUniqueItemsCount: () => {
        const { items } = get();
        return items.length;
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          // Extract numeric value from price string, handling different formats
          // Remove all non-numeric characters except dots and commas
          const cleanPrice = String(item.price).replace(/[^\d.,]/g, "");

          // Handle different price formats
          let price = 0;
          if (cleanPrice.includes(",")) {
            // If comma exists, treat it as decimal separator (e.g., "12,50")
            price = parseFloat(cleanPrice.replace(",", ".")) || 0;
          } else if (cleanPrice.includes(".")) {
            // If only dot exists, check if it's likely a thousands separator
            const parts = cleanPrice.split(".");
            if (parts.length === 2 && parts[1].length <= 2) {
              // Likely decimal (e.g., "12.50")
              price = parseFloat(cleanPrice) || 0;
            } else {
              // Likely thousands separator (e.g., "12.000")
              price = parseFloat(cleanPrice.replace(/\./g, "")) || 0;
            }
          } else {
            price = parseFloat(cleanPrice) || 0;
          }

          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "nyam-web-cart",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

export default useCartStore;
