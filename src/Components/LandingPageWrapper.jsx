// src/components/LandingPageWrapper.jsx
import { useEffect, useState } from "react";
import { Box, Spinner, Center, Text, Button } from "@chakra-ui/react";
import useStoreConfigStore from "../store/useStoreConfigStore";
import LandingPage from "../pages/LandingPage";
import axios from "axios";
import env from "../config/env";

const LoadingSpinner = () => (
  <Center minH="100vh" bg="gray.50">
    <Box textAlign="center">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
        mb={4}
      />
      <Text fontSize="lg" color="gray.600">
        Cargando tu tienda...
      </Text>
    </Box>
  </Center>
);

const ErrorDisplay = ({ onRetry }) => (
  <Center minH="100vh" bg="gray.50">
    <Box textAlign="center" p={8} maxW="md">
      <Text color="red.500" fontSize="lg" mb={4}>
        No se pudo cargar la configuración de la tienda
      </Text>
      <Text color="gray.600" mb={6}>
        Estamos usando la configuración básica. Puedes continuar navegando o
        intentar recargar.
      </Text>
      {onRetry && (
        <Button colorScheme="blue" onClick={onRetry} size="sm" mt={2}>
          Reintentar carga
        </Button>
      )}
    </Box>
  </Center>
);

const LandingPageWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const config = useStoreConfigStore((state) => state.config);
  const resetConfig = useStoreConfigStore((state) => state.resetConfig);
  const setConfig = useStoreConfigStore((state) => state.setConfig);

  const transformBackendConfig = (backendConfig) => {
    const parsedFeatures =
      typeof backendConfig.features === "string"
        ? JSON.parse(backendConfig.features)
        : backendConfig.features;

    return {
      title: backendConfig.title || "eShop",
      backgroundColor: backendConfig.backgroundColor || "#FFFFFF",
      headerColor: backendConfig.headerColor || "#FFFFFF",
      headerTextColor: backendConfig.headerTextColor || "#000000",
      textColor: backendConfig.textColor || "#333333",
      primaryColor: backendConfig.primaryColor || "#3182CE",
      secondaryColor: backendConfig.secondaryColor || "#FFFFFF",
      buttonColor: backendConfig.buttonColor || "#4299E1",
      buttonTextColor: backendConfig.buttonTextColor || "#FFFFFF",
      buttonHoverOpacity: backendConfig.buttonHoverOpacity || 0.8,
      buttonFontSize: backendConfig.buttonFontSize || "16px",
      buttonBorderRadius: backendConfig.buttonBorderRadius || "4px",
      asideColor: backendConfig.asideColor || "#F7FAFC",
      logo: backendConfig.logo || null,
      language: backendConfig.language || "es",
      currency: "EUR",
      mainFont: backendConfig.mainFont || "'Roboto', sans-serif",
      whatsappNumber: backendConfig.whatsappNumber || "+573025479797",
      footer: {
        storeInfo: [{ name: "Sobre Nosotros", url: "/" }],
        customerService: [
          { name: "Envíos", url: "/contact" },
          { name: "Devoluciones", url: "/contact" },
          { name: "Garantía", url: "/contact" },
        ],
        contact: {
          address: backendConfig.address || "Dirección no disponible",
          phone: backendConfig.phone || "Teléfono no disponible",
          email: backendConfig.email || "Correo no disponible",
        },
        socialLinks: [
          { name: "Facebook", url: backendConfig.facebook || "#" },
          { name: "Twitter", url: backendConfig.twitter || "#" },
          { name: "Instagram", url: backendConfig.instagram || "#" },
        ],
      },
      landingPage: {
        heroBgGradient: backendConfig.heroBgGradient || "linear(to-r, teal.500, blue.500)",
        heroTextColor: backendConfig.heroTextColor || "#000000",
        heroTitle: backendConfig.heroTitle || "Software administrativo enterprise",
        heroSubtitle: backendConfig.heroSubtitle || "La solución informática pensada para su empresa",
        heroButtonText: backendConfig.heroButtonText || "Explorar Productos",
        heroButtonColorScheme: backendConfig.heroButtonColorScheme || "teal",
        heroImage: backendConfig.heroImage || "",
        featuresTitle: backendConfig.featuresTitle || "Por qué elegirnos",
        featuresSubtitle:
          backendConfig.featuresSubtitle ||
          "16 años de experiencia en la industria del software administrativo",
        features: parsedFeatures || [],
      },
    };
  };

  const loadStoreConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(env.PUBLIC.CONFIG, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data[0]) {
        const transformedConfig = transformBackendConfig(response.data[0]);
        setConfig(transformedConfig);
      }
    } catch (err) {
      console.error("Error al cargar la configuración:", err);
      setError(err.message || "Error al cargar la configuración");
      resetConfig(); // Usar configuración por defecto en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoreConfig();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay onRetry={loadStoreConfig} />;
  }

  return <LandingPage />;
};

export default LandingPageWrapper;
