import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "@/lib";
import { Product } from "@/api/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getCartItem: (productId: number) => CartItem | undefined;
  getTotalItems: () => number;
  getUniqueItemsCount: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (product: Product) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          // Check if we can add more items based on stock
          if (product.stock && existingItem.quantity >= product.stock) {
            return; // Don't add more if stock limit reached
          }
          // If item exists, increase quantity
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          // Add new item with quantity 1
          set({
            items: [...items, { ...product, quantity: 1 }]
          });
        }
      },

      removeFromCart: (productId: number) => {
        const { items } = get();
        set({
          items: items.filter(item => item.id !== productId)
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const { items } = get();
        const item = items.find(item => item.id === productId);

        // Check stock limit if product has stock information
        if (item && item.stock && quantity > item.stock) {
          return; // Don't update if quantity exceeds stock
        }

        set({
          items: items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      isInCart: (productId: number) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },

      getCartItem: (productId: number) => {
        const { items } = get();
        return items.find(item => item.id === productId);
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
          const price = parseFloat(item.currentPrice.replace(/[^\d.]/g, ''));
          return total + (price * item.quantity);
        }, 0);
      },
    }),
    {
      name: "nyam-cart",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

export default useCartStore;
