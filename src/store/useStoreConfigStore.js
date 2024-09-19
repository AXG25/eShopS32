import { create } from "zustand";
import { persist } from "zustand/middleware";
import { changeLanguage } from "../i18n";
import axios from "axios"; // Asegúrate de tener axios instalado

const useStoreConfigStore = create(
  persist(
    (set, get) => ({
      config: {
        title: "Mi E-commerce",
        primaryColor: "#3182CE",
        secondaryColor: "#ED64A6",
        darkModePrimaryColor: "#90CDF4",
        darkModeSecondaryColor: "#F687B3",
        logo: "/default-logo.png",
        language: "es",
        currency: "EUR",
        darkMode: false,
      },
      setConfig: (newConfig) => {
        set((state) => {
          const updatedConfig = { ...state.config, ...newConfig };

          // Si el idioma ha cambiado, actualizar i18next
          if (
            newConfig.language &&
            newConfig.language !== state.config.language
          ) {
            changeLanguage(newConfig.language);
          }

          // Aplicar el modo oscuro
          if (newConfig.darkMode !== undefined) {
            document.documentElement.classList.toggle(
              "dark",
              newConfig.darkMode
            );
          }

          return { config: updatedConfig };
        });
      },
      saveConfigToBackend: async () => {
        const config = get().config;
        try {
          await axios.post("/api/store-config", config);
          console.log("Configuración guardada en el backend");
        } catch (error) {
          console.error(
            "Error al guardar la configuración en el backend:",
            error
          );
        }
      },
      loadConfigFromBackend: async () => {
        try {
          const response = await axios.get("/api/store-config");
          set({ config: response.data });
          console.log("Configuración cargada desde el backend");
        } catch (error) {
          console.error(
            "Error al cargar la configuración desde el backend:",
            error
          );
        }
      },
      syncConfig: async () => {
        const localConfig = get().config;
        try {
          const response = await axios.get("/api/store-config");
          const backendConfig = response.data;

          // Comparar las fechas de última modificación
          if (
            new Date(backendConfig.lastModified) >
            new Date(localConfig.lastModified)
          ) {
            set({ config: backendConfig });
            console.log("Configuración actualizada desde el backend");
          } else if (
            new Date(backendConfig.lastModified) <
            new Date(localConfig.lastModified)
          ) {
            await get().saveConfigToBackend();
            console.log("Configuración local actualizada en el backend");
          } else {
            console.log("La configuración está sincronizada");
          }
        } catch (error) {
          console.error("Error al sincronizar la configuración:", error);
        }
      },
    }),
    {
      name: "store-config-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useStoreConfigStore;
