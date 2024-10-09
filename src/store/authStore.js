// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import env from "../config/env";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setPermissions: (permissions) => set({ permissions }),
      login: async (credentials) => {
        try {
          const loginUrl = env.AUTH.LOGIN
          const response = await axios.post(loginUrl, credentials);
          const {
            user,
            token,
            user: { permissions = ["user"] },
          } = response.data ?? {};
          console.log("permissions", response.data);
          set({
            user,
            token,
            permissions,
            isAuthenticated: true,
          });
          return response.data;
        } catch (error) {
          console.error("Error durante el login:", error);
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
