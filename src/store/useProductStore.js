import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";

const useProductStore = create(
  devtools(
    persist(
      (set, get) => ({
        products: [],
        filteredProducts: [],
        featuredProducts: [],
        isLoading: false,
        error: null,
        filters: {
          priceRange: [0, Infinity],
          category: '',
          sortBy: '',
        },
        fetchProducts: async () => {
          if (get().products.length > 0) return; // Evita fetchs innecesarios
          set({ isLoading: true });
          try {
            const response = await axios.get("https://fakestoreapi.com/products");
            const products = response.data;
            set({ 
              products, 
              filteredProducts: products, 
              featuredProducts: products.slice(0, 10),
              isLoading: false 
            });
          } catch (error) {
            set({ error: error.message, isLoading: false });
          }
        },
        setFilters: (newFilters) => {
          set((state) => {
            const updatedFilters = { ...state.filters, ...newFilters };
            const filteredProducts = state.products.filter((product) => {
              const [min, max] = updatedFilters.priceRange;
              const priceInRange = product.price >= min && product.price <= max;
              const categoryMatch = !updatedFilters.category || product.category === updatedFilters.category;
              return priceInRange && categoryMatch;
            });

            if (updatedFilters.sortBy) {
              filteredProducts.sort((a, b) => {
                switch (updatedFilters.sortBy) {
                  case 'price_asc': return a.price - b.price;
                  case 'price_desc': return b.price - a.price;
                  case 'name_asc': return a.title.localeCompare(b.title);
                  case 'name_desc': return b.title.localeCompare(a.title);
                  default: return 0;
                }
              });
            }

            return { filters: updatedFilters, filteredProducts };
          });
        },
        addProduct: (product) =>
          set((state) => ({
            products: [...state.products, product],
            filteredProducts: [...state.filteredProducts, product],
          })),
        updateProduct: (id, updatedProduct) =>
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id ? { ...product, ...updatedProduct } : product
            ),
            filteredProducts: state.filteredProducts.map((product) =>
              product.id === id ? { ...product, ...updatedProduct } : product
            ),
          })),
        deleteProduct: (id) =>
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
            filteredProducts: state.filteredProducts.filter((product) => product.id !== id),
          })),
        updateProductLikes: (id, likes) =>
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id ? { ...product, likes } : product
            ),
            filteredProducts: state.filteredProducts.map((product) =>
              product.id === id ? { ...product, likes } : product
            ),
          })),
        getFeaturedProducts: () => get().featuredProducts,
      }),
      {
        name: "product-storage",
        getStorage: () => localStorage,
      }
    )
  )
);

export default useProductStore;