import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseFloat } from "../utils/numberFormatting";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItemToCart: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { ...product, quantity: 1 }] };
          }
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce(
          (total, item) =>
            total + parseFloat(item.quantity, { defaultValu: 0 }),
          0
        );
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            parseFloat(item.price, { defaultValu: 0 }) *
              parseFloat(item.quantity, { defaultValu: 0 }),
          0
        );
      },
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
