import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProductData } from "@/types";

export interface CartItem extends ProductData {
  id: string;
  quantity: number;
  surprise_bag?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

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
          if (product.count && existingItem.quantity >= product.count) {
            return;
          }
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
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

        if (item && item.count && quantity > item.count) {
          return;
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
        localStorage.removeItem("nyam-web-cart");
        set({ items: [] });
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
          const cleanPrice = String(item.price).replace(/[^\d.,]/g, "");

          let price = 0;
          if (cleanPrice.includes(",")) {
            price = parseFloat(cleanPrice.replace(",", ".")) || 0;
          } else if (cleanPrice.includes(".")) {
            const parts = cleanPrice.split(".");
            if (parts.length === 2 && parts[1].length <= 2) {
              price = parseFloat(cleanPrice) || 0;
            } else {
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
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;
