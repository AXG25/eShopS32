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

        if (user) {
          // Obtener la configuración por defecto
          const defaultConfig = useStoreConfigStore.getState().config;

          // Crear un nuevo objeto de configuración mezclando los valores del usuario con los valores por defecto
          const newConfig = {
            // Configuración general
            title: user.title || defaultConfig.title,
            description: user.description || defaultConfig.description,
            logo: user.logo || defaultConfig.logo,
            language: user.language || defaultConfig.language,
            mainFont: user.mainFont || defaultConfig.mainFont,

            // Colores y estilos
            backgroundColor: user.backgroundColor || defaultConfig.backgroundColor,
            headerColor: user.headerColor || defaultConfig.headerColor,
            headerTextColor: user.headerTextColor || defaultConfig.headerTextColor,
            textColor: user.textColor || defaultConfig.textColor,
            primaryColor: user.primaryColor || defaultConfig.primaryColor,
            secondaryColor: user.secondaryColor || defaultConfig.secondaryColor,
            buttonColor: user.buttonColor || defaultConfig.buttonColor,
            buttonTextColor: user.buttonTextColor || defaultConfig.buttonTextColor,
            buttonHoverOpacity: user.buttonHoverOpacity || defaultConfig.buttonHoverOpacity,
            buttonFontSize: user.buttonFontSize || defaultConfig.buttonFontSize,
            buttonBorderRadius: user.buttonBorderRadius || defaultConfig.buttonBorderRadius,
            asideColor: user.asideColor || defaultConfig.asideColor,

            // Información de contacto
            whatsappNumber: user.whatsappNumber || defaultConfig.whatsappNumber,
            facebook: user.facebook || defaultConfig.facebook,
            instagram: user.instagram || defaultConfig.instagram,
            twitter: user.twitter || defaultConfig.twitter,
            email: user.email || defaultConfig.email,
            phone: user.phone || defaultConfig.phone,

            // Footer
            footer: {
              ...defaultConfig.footer,
              contact: {
                address: user.address || defaultConfig.footer.contact.address,
                phone: user.phone || defaultConfig.footer.contact.phone,
                email: user.email || defaultConfig.footer.contact.email,
              },
              socialLinks: [
                { name: "Facebook", url: user.facebook || defaultConfig.footer.socialLinks[0].url },
                { name: "Twitter", url: user.twitter || defaultConfig.footer.socialLinks[1].url },
                { name: "Instagram", url: user.instagram || defaultConfig.footer.socialLinks[2].url },
              ],
            },

            // Landing page
            landingPage: {
              ...defaultConfig.landingPage,
              heroBgGradient: user.heroBgGradient || defaultConfig.landingPage.heroBgGradient,
              heroTextColor: user.heroTextColor || defaultConfig.landingPage.heroTextColor,
              heroTitle: user.heroTitle || defaultConfig.landingPage.heroTitle,
              heroSubtitle: user.heroSubtitle || defaultConfig.landingPage.heroSubtitle,
              heroButtonText: user.heroButtonText || defaultConfig.landingPage.heroButtonText,
              heroButtonColorScheme: user.heroButtonColorScheme || defaultConfig.landingPage.heroButtonColorScheme,
              heroImage: user.heroImage || defaultConfig.landingPage.heroImage,
              featuresTitle: user.featuresTitle || defaultConfig.landingPage.featuresTitle,
              featuresSubtitle: user.featuresSubtitle || defaultConfig.landingPage.featuresSubtitle,
              features: user.features ? 
                JSON.parse(user.features) : 
                defaultConfig.landingPage.features,
            },
          };

          // Actualizar la configuración en el store
          useStoreConfigStore.getState().setConfig(newConfig);
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