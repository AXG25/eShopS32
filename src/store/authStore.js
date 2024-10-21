// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import env from "../config/env";
import useStoreConfigStore from "./useStoreConfigStore";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        // Actualizar la configuración de la tienda
        if (user) {
          useStoreConfigStore.getState().setConfig({
            title: user.title,
            backgroundColor: user.backgroundColor,
            headerColor: user.headerColor,
            headerTextColor: user.headerTextColor,
            textColor: user.textColor,
            primaryColor: user.primaryColor,
            secondaryColor: user.secondaryColor,
            buttonColor: user.buttonColor,
            buttonTextColor: user.buttonTextColor,
            buttonHoverOpacity: user.buttonHoverOpacity,
            buttonFontSize: user.buttonFontSize,
            buttonBorderRadius: user.buttonBorderRadius,
            asideColor: user.asideColor,
            logo: user.logo,
            language: user.language,
            mainFont: user.mainFont,
            // Añade aquí otras propiedades de configuración que vengan del usuario
          });
        }
      },
      setToken: (token) => set({ token }),
      setPermissions: (permissions) => set({ permissions }),
      login: async (credentials) => {
        try {
          const loginUrl = env.AUTH.LOGIN;
          const response = await axios.post(loginUrl, credentials);
          const {
            user,
            token,
            user: { permissions = ["user"] },
          } = response.data ?? {};

          // Usar la función setUser para actualizar el usuario y la configuración
          get().setUser(user);
          set({
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
        // Resetear la configuración de la tienda al cerrar sesión
        useStoreConfigStore.getState().resetConfig();
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
