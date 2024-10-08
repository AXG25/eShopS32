import { create } from "zustand";
import { persist } from "zustand/middleware";
import { changeLanguage } from "../i18n";
import axios from "axios";
import { FaHeadset, FaRocket, FaUser } from "react-icons/fa";
import env from "../config/env";
import useAuthStore from "./authStore";

const defaultConfig = {
  title: "Mi E-commerce",
  backgroundColor: "#FFFFFF",
  headerColor: "#FFFFFF",
  headerTextColor: "#000000",
  textColor: "#333333",
  primaryColor: "#3182CE",
  secondaryColor: "#FFFFFF",
  buttonColor: "#4299E1",
  buttonTextColor: "#FFFFFF",
  buttonHoverOpacity: 0.8,
  buttonFontSize: "16px",
  buttonBorderRadius: "4px",
  asideColor: "#F7FAFC",
  logo: null,
  language: "es",
  currency: "EUR",
  mainFont: "'Roboto', sans-serif",
  footer: {
    storeInfo: [
      { name: "Sobre Nosotros", url: "/about" },
      { name: "Términos y Condiciones", url: "/terms" },
      { name: "Política de Privacidad", url: "/privacy" },
    ],
    customerService: [
      { name: "Preguntas Frecuentes", url: "/faq" },
      { name: "Envíos", url: "/shipping" },
      { name: "Devoluciones", url: "/returns" },
      { name: "Garantía", url: "/warranty" },
    ],
    myAccount: [
      { name: "Mi Perfil", url: "/profile" },
      { name: "Mis Pedidos", url: "/orders" },
      { name: "Lista de Deseos", url: "/wishlist" },
      { name: "Notificaciones", url: "/notifications" },
    ],
    contact: {
      address: "43 Raymouth Rd. Baltemoer, London 3910",
      phone: "+1(123)-456-7890",
      email: "info@mydomain.com",
    },
    socialLinks: [
      { name: "Facebook", url: "https://facebook.com" },
      { name: "Twitter", url: "https://twitter.com" },
      { name: "Instagram", url: "https://instagram.com" },
      { name: "Pinterest", url: "https://pinterest.com" },
    ],
  },
  // Nueva sección para la configuración de la Landing Page
  landingPage: {
    heroBgGradient: "linear(to-r, teal.500, blue.500)",
    heroTextColor: "white",
    heroTitle: "Software administrativo enterprise",
    heroSubtitle: "La solución informática pensada para su empresa",
    heroButtonText: "Explorar Productos",
    heroButtonColorScheme: "teal",
    heroImage: "/featured-product.png",
    featuresTitle: "Por qué elegirnos",
    featuresSubtitle:
      "16 años de experiencia en la industria del software administrativo y punto de venta nos ha permitido entender y cubrir las necesidades de nuestros clientes",
    features: [
      {
        icon: FaUser,
        title: "Implementaciones con compromiso",
        description:
          "Al adquirir uno de nuestros productos va a experimentar cómo nuestros analistas de soportes y los distribuidores autorizados le dan el acompañamiento que necesite.",
      },
      {
        icon: FaRocket,
        title: "System32 es fácil de usar",
        description:
          "Nuestra interfaz de usuario está detalladamente trabajada para que su aprendizaje sea intuitivo. Desde su creación nuestro software se ha caracterizado por su diseño.",
      },
      {
        icon: FaHeadset,
        title: "Soporte técnico de valor",
        description:
          "Constantemente capacitamos a nuestro personal y a nuestros distribuidores con los programas informáticos de System32 para que puedan dar respuesta oportuna y eficaz para evitar que su empresa se mantenga operativa.",
      },
    ],
  },
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
        const {
          token,
          user: { id },
        } = useAuthStore.getState();

        if (!token) {
          console.error("No se encontro un token válido");
          return;
        }

        try {
          await axios.put(`${env.CUSTOMIZED.BASE}/${id}`, config, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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
          const loadedConfig = { ...defaultConfig, ...response.data };
          set({ config: loadedConfig });
          applyStyleChanges(loadedConfig);
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
            const syncedConfig = { ...defaultConfig, ...backendConfig };
            set({ config: syncedConfig });
            applyStyleChanges(syncedConfig);
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
      updateFooterConfig: (newFooterConfig) => {
        set((state) => ({
          config: {
            ...state.config,
            footer: {
              ...state.config.footer,
              ...newFooterConfig,
            },
          },
        }));
      },
      // Nueva función para actualizar la configuración de la Landing Page
      updateLandingPageConfig: (newLandingPageConfig) => {
        set((state) => ({
          config: {
            ...state.config,
            landingPage: {
              ...state.config.landingPage,
              ...newLandingPageConfig,
            },
          },
        }));
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
    if (typeof value === "string") {
      if (
        value.startsWith("#") ||
        key.includes("FontSize") ||
        key.includes("BorderRadius")
      ) {
        root.style.setProperty(`--${key}`, value);
      }
      if (value.startsWith("#")) {
        const rgbValue = hexToRgb(value);
        if (rgbValue) {
          root.style.setProperty(`--${key}-rgb`, rgbValue);
        }
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
