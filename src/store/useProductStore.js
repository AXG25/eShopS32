/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";
import env from "../config/env";
import useAuthStore from "./authStore";

const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

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
          category: "",
          sortBy: "",
          search: "",
        },
        syncDatabase: async () => {
          set({ isLoading: true, error: null });
          try {
            const { token, user } = useAuthStore.getState();
            if (!token || !user) {
              throw new Error(
                "No se encontró un token válido o información de usuario"
              );
            }

            const syncUrl = `${env.PRODUCTS.SYNC}/${user.id}`;
            const res = await axios.post(
              syncUrl,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            set({ isLoading: false });
            return {
              success: true,
              message: "Base de datos sincronizada correctamente",
            };
          } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, message: error.message };
          }
        },
        fetchProducts: async (params = {}) => {
          set({ isLoading: true, error: null });
          try {
            const {
              category,
              priceRange,
              sortBy,
              search,
              page = 1,
              limit = 12,
            } = params;
            let url = `${env.PRODUCTS.BASE}?page=${page}&limit=${limit}`;

            if (category) url += `&category=${encodeURIComponent(category)}`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (priceRange && priceRange[0] > 0)
              url += `&minPrice=${priceRange[0]}`;
            if (priceRange && priceRange[1] < Infinity)
              url += `&maxPrice=${priceRange[1]}`;
            if (sortBy) {
              const [field, order] = sortBy.split("_");
              const sortField = field === "name" ? "title" : field;
              url += `&sortBy=${sortField}&order=${order}`;
            }

            const response = await axios.get(url);
            set({ isLoading: false });
            return response.data;
          } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        },
        setFilters: (newFilters) => {
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          }));
        },
        clearFilters: () => {
          set((state) => ({
            filters: {
              priceRange: [0, Infinity],
              category: "",
              sortBy: "",
              search: "",
            },
          }));
        },
        addProduct: async (newProduct) => {
          set({ isLoading: true, error: null });
          try {
            const { token, user } = useAuthStore.getState();
            if (!token || !user) {
              throw new Error("No se encontró un token válido o información de usuario");
            }

            let productWithBase64Image = { ...newProduct };

            if (newProduct.image instanceof File) {
              const base64Image = await convertImageToBase64(newProduct.image);
              productWithBase64Image.image = base64Image;
            }

            const productWithShopUsername = {
              ...productWithBase64Image,
              shop_username: user.username
            };

            const addUrl = `${env.PRODUCTS.BASE}`;
            const response = await axios.post(addUrl, productWithShopUsername, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            set((state) => ({
              products: [...state.products, response.data],
              isLoading: false,
            }));

            return response.data;
          } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        },
        updateProduct: async (updatedProduct) => {
          set({ isLoading: true, error: null });
          try {
            const { token, user } = useAuthStore.getState();
            if (!token || !user) {
              throw new Error("No se encontró un token válido o información de usuario");
            }

            let productWithBase64Image = { ...updatedProduct };

            if (updatedProduct.image instanceof File) {
              const base64Image = await convertImageToBase64(updatedProduct.image);
              productWithBase64Image.image = base64Image;
            }

            const updateUrl = `${env.PRODUCTS.BASE}/${updatedProduct.id}`;
            const response = await axios.put(updateUrl, productWithBase64Image, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            set((state) => ({
              products: state.products.map((product) => 
                product.id === updatedProduct.id ? response.data : product
              ),
              isLoading: false,
            }));

            return response.data;
          } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        },
        deleteProduct: async (productId) => {
          set({ isLoading: true, error: null });
          try {
            const { token, user } = useAuthStore.getState();
            if (!token || !user) {
              throw new Error("No se encontró un token válido o información de usuario");
            }

            const deleteUrl = `${env.PRODUCTS.BASE}/${productId}`;
            await axios.delete(deleteUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            set((state) => ({
              products: state.products.filter((product) => product.id !== productId),
              isLoading: false,
            }));

            return { success: true, message: "Producto eliminado correctamente" };
          } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error; // Lanzamos el error para que pueda ser manejado en el componente
          }
        },
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
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    )
  )
);

export default useProductStore;
