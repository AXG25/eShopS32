import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () =>
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
        }),
      login: async (credentials) => {
        // Simula una llamada a la API
        const response = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (response.ok) {
          set({
            user: data.user,
            token: data.token,
            permissions: data.permissions,
            isAuthenticated: true,
          });
          return data;
        } else {
          throw new Error(data.message);
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
