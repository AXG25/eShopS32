import { create } from "zustand";
import { persist } from "zustand/middleware";
import { changeLanguage } from "../i18n";
import axios from "axios";
import env from "../config/env";
import useAuthStore from "./authStore";
import toast from "react-hot-toast";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

const defaultConfig = {
  title: "eShop",
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
  whatsappNumber: "+573025479797",
  footer: {
    storeInfo: [
      { name: "Sobre Nosotros", url: "/" },
      /* { name: "Términos y Condiciones", url: "/terms" },
      { name: "Política de Privacidad", url: "/privacy" }, */
    ],
    customerService: [
     /*  { name: "Preguntas Frecuentes", url: "/faq" }, */
      { name: "Envíos", url: "/contact" },
      { name: "Devoluciones", url: "/contact" },
      { name: "Garantía", url: "/contact" },
    ],
    /* myAccount: [
      { name: "Mi Perfil", url: "/profile" },
      { name: "Mis Pedidos", url: "/orders" },
      { name: "Lista de Deseos", url: "/wishlist" },
      { name: "Notificaciones", url: "/notifications" },
    ], */
    contact: {
      address: "43 Raymouth Rd. Baltemoer, London 3910",
      phone: "+1(123)-456-7890",
      email: "info@mydomain.com",
    },
    socialLinks: [
      { name: "Facebook", url: "https://facebook.com" },
      { name: "Twitter", url: "https://twitter.com" },
      { name: "Instagram", url: "https://instagram.com" },
    ],
  },
  landingPage: {
    heroBgGradient: "linear(to-r, teal.500, blue.500)",
    heroTextColor: "#000000",
    heroTitle: "Software administrativo enterprise",
    heroSubtitle: "La solución informática pensada para su empresa",
    heroButtonText: "Explorar Productos",
    heroButtonColorScheme: "teal",
    heroImage: "",
    featuresTitle: "Por qué elegirnos",
    featuresSubtitle:
      "16 años de experiencia en la industria del software administrativo y punto de venta nos ha permitido entender y cubrir las necesidades de nuestros clientes",
    features: [
      {
        icon: "FaUser",
        title: "Implementaciones con compromiso",
        description:
          "Al adquirir uno de nuestros productos va a experimentar cómo nuestros analistas de soportes y los distribuidores autorizados le dan el acompañamiento que necesite.",
      },
      {
        icon: "FaRocket",
        title: "System32 es fácil de usar",
        description:
          "Nuestra interfaz de usuario está detalladamente trabajada para que su aprendizaje sea intuitivo. Desde su creación nuestro software se ha caracterizado por su diseño.",
      },
      {
        icon: "FaHeadset",
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
      getConfigValue: (key, defaultValue) => {
        const state = get();
        const value = state.config[key];
        return value !== undefined ? value : defaultValue;
      },
      setConfig: (newConfig) => {
        set((state) => {
          const updatedConfig = { ...state.config, ...newConfig };
          
          // Manejo del logo
          if (newConfig.logo && typeof newConfig.logo === 'string') {
            if (!newConfig.logo.startsWith('data:image')) {
              console.warn('El logo debe ser una cadena base64 válida');
              updatedConfig.logo = state.config.logo; // Mantén el logo anterior si el nuevo no es válido
            }
          }

          if (newConfig.whatsappNumber) {
            try {
              if (isValidPhoneNumber(newConfig.whatsappNumber)) {
                const parsedNumber = parsePhoneNumber(newConfig.whatsappNumber);
                updatedConfig.whatsappNumber = parsedNumber.number;
              } else {
                console.error("Número de WhatsApp inválido");
                updatedConfig.whatsappNumber = state.config.whatsappNumber;
              }
            } catch (error) {
              console.error("Error al procesar el número de WhatsApp:", error);
              updatedConfig.whatsappNumber = state.config.whatsappNumber;
            }
          }
          if (
            newConfig.language &&
            newConfig.language !== state.config.language
          ) {
            changeLanguage(newConfig.language);
          }

          applyStyleChanges(updatedConfig);

          return { config: updatedConfig };
        });
      },
      setLogo: (logoBase64) => {
        if (typeof logoBase64 === 'string' && logoBase64.startsWith('data:image')) {
          set((state) => ({
            config: { ...state.config, logo: logoBase64 },
          }));
        } else {
          console.warn('setLogo recibió un valor inválido. Debe ser una cadena base64 válida.');
        }
      },
      resetConfig: () => {
        set({ config: { ...defaultConfig } });
        changeLanguage(defaultConfig.language);
        applyStyleChanges(defaultConfig);
      },
      saveConfigToBackend: async () => {
        const currentConfig = get().config;

        // Preparar los datos para enviar al backend
        const configToSave = {
          ...currentConfig,
          landingPage: {
            ...currentConfig.landingPage,
            features: JSON.stringify(currentConfig.landingPage.features),
          },
        };

        const {
          token,
          user: { id },
        } = useAuthStore.getState();

        if (!token) {
          console.error("No se encontró un token válido");
          return;
        }

        try {
          await axios.put(`${env.CUSTOMIZED.BASE}/${id}`, configToSave, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Configuración guardada en el backend");
        } catch (error) {
          console.error("Error al guardar la configuración:", error);
          toast.error("Error al guardar la configuración");
        }
      },
      loadConfigFromBackend: async () => {
        try {
          const response = await axios.get("/api/store-config");
          const loadedConfig = { ...defaultConfig, ...response.data };

          // Asegurarse de que el número de WhatsApp sea válido
          if (loadedConfig.whatsappNumber) {
            try {
              if (isValidPhoneNumber(loadedConfig.whatsappNumber)) {
                const parsedNumber = parsePhoneNumber(
                  loadedConfig.whatsappNumber
                );
                loadedConfig.whatsappNumber = parsedNumber.number;
              } else {
                console.error(
                  "Número de WhatsApp cargado inválido, usando el valor por defecto"
                );
                loadedConfig.whatsappNumber = defaultConfig.whatsappNumber;
              }
            } catch (error) {
              console.error(
                "Error al procesar el número de WhatsApp cargado:",
                error
              );
              loadedConfig.whatsappNumber = defaultConfig.whatsappNumber;
            }
          }

          // Parsear features de JSON a objeto si existe
          if (loadedConfig.landingPage && loadedConfig.landingPage.features) {
            loadedConfig.landingPage.features = JSON.parse(
              loadedConfig.landingPage.features
            );
          }

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
