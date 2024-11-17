// src/components/LandingPageWrapper.jsx
import { useEffect, useState } from "react";
import { Box, Spinner, Center, Text, Button } from "@chakra-ui/react";
import useStoreConfigStore from "../store/useStoreConfigStore";
import LandingPage from "../pages/LandingPage";
import useAuthStore from "../store/authStore";
import axios from "axios";
import env, { STORE_NAME } from "../config/env";

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

  const loadStoreConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar configuración pública
      const response = await axios.get(env.PUBLIC.CONFIG, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data?.data) {
        // Usar la configuración existente como base
        const currentConfig = useStoreConfigStore.getState().config;

        // Procesar las características si existen
        const features = response.data.data.landingPage?.features;
        let processedFeatures = currentConfig.landingPage.features;

        if (features) {
          try {
            processedFeatures =
              typeof features === "string" ? JSON.parse(features) : features;
          } catch (e) {
            console.warn("Error parsing features:", e);
          }
        }

        // Mezclar configuraciones
        const newConfig = {
          ...currentConfig,
          ...response.data.data,
          landingPage: {
            ...currentConfig.landingPage,
            ...(response.data.data.landingPage || {}),
            features: processedFeatures,
          },
        };

        setConfig(newConfig);
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

  // Verificar que tenemos una configuración válida
  if (!config || !config.landingPage) {
    console.warn(
      "Configuración incompleta o inválida, usando valores por defecto"
    );
    resetConfig();
    return <ErrorDisplay onRetry={loadStoreConfig} />;
  }

  return <LandingPage />;
};

export default LandingPageWrapper;
