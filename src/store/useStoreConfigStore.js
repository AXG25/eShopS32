import { create } from "zustand";
import { persist } from "zustand/middleware";
import { changeLanguage } from "../i18n";
import axios from "axios";

const defaultConfig = {
  title: "Mi E-commerce",
  backgroundColor: "#FFFFFF",
  headerColor: "#FFFFFF",
  headerTextColor: "#000000",
  textColor: "#333333",
  primaryColor: "#3182CE",
  secondaryColor: "#ED64A6",
  buttonColor: "#4299E1",
  buttonTextColor: "#FFFFFF",
  buttonHoverOpacity: 0.8,
  asideColor: "#F7FAFC",
  logo: null,
  language: "es",
  currency: "EUR",
};

const useStoreConfigStore = create(
  persist(
    (set, get) => ({
      config: { ...defaultConfig },
      setConfig: (newConfig) => {
        set((state) => {
          const updatedConfig = { ...state.config, ...newConfig };
          if (
            newConfig.language &&
            newConfig.language !== state.config.language
          ) {
            changeLanguage(newConfig.language);
          }

          // Aplicar cambios inmediatamente
          applyStyleChanges(updatedConfig);

          return { config: updatedConfig };
        });
      },
      setLogo: (logoUrl) => {
        set((state) => ({
          config: { ...state.config, logo: logoUrl },
        }));
      },
      resetConfig: () => {
        set({ config: { ...defaultConfig } });
        changeLanguage(defaultConfig.language);
        applyStyleChanges(defaultConfig);
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
          applyStyleChanges(response.data);
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

          if (
            new Date(backendConfig.lastModified) >
            new Date(localConfig.lastModified)
          ) {
            set({ config: backendConfig });
            applyStyleChanges(backendConfig);
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

// Función para aplicar cambios de estilo en tiempo real
const applyStyleChanges = (config) => {
  const root = document.documentElement;
  Object.entries(config).forEach(([key, value]) => {
    if (typeof value === "string" && value.startsWith("#")) {
      root.style.setProperty(`--${key}`, value);
      const rgbValue = hexToRgb(value);
      if (rgbValue) {
        root.style.setProperty(`--${key}-rgb`, rgbValue);
      }
    }
  });

  // Aplicar opacidad al hover de los botones
  root.style.setProperty("--button-hover-opacity", config.buttonHoverOpacity);
};

// Función auxiliar para convertir HEX a RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null;
};

export default useStoreConfigStore;
