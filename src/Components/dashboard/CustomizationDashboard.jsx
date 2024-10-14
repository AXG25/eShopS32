import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  HStack,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import {
  FaCog,
  FaPalette,
  FaBoxOpen,
  FaList,
  FaHome,
  FaSync,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import DesignTab from "./DesignTab";
import { GeneralTab } from "./GeneralTab";
import { ProductTab } from "./ProductTab";
import { FooterTab } from "./FooterTab";
import LandingPageTab from "./LandingPageTab"; // Nuevo componente
import useStoreConfigStore from "../../store/useStoreConfigStore";
import useProductStore from "../../store/useProductStore";
import CustomButton from "../common/CustomButton";

const MotionBox = motion(Box);

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const CustomizationDashboard = () => {
  const { config, setConfig, saveConfigToBackend, syncConfig } =
    useStoreConfigStore();
  const [localConfig, setLocalConfig] = useState(config);
  const { products, deleteProduct, syncDatabase } = useProductStore();
  const toast = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    syncConfig();
  }, [syncConfig]);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSaveConfig = useCallback(async () => {
    setConfig(localConfig);
    await saveConfigToBackend();
    toast({
      title: "Configuración guardada",
      description:
        "Cambios guardados de forma local",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [localConfig, setConfig, saveConfigToBackend, toast]);

  const handleDeleteProduct = useCallback(
    (id) => {
      if (
        window.confirm("¿Estás seguro de que quieres eliminar este producto?")
      ) {
        deleteProduct(id);
      }
    },
    [deleteProduct]
  );

  const handleFooterConfigChange = useCallback((newFooterConfig) => {
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      footer: newFooterConfig,
    }));
  }, []);

  const handleLandingPageConfigChange = useCallback((newLandingPageConfig) => {
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      landingPage: {
        ...prevConfig.landingPage,
        ...newLandingPageConfig,
      },
    }));
  }, []);

  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    const simulateProgress = () => {
      setSyncProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    };

    const progressInterval = setInterval(simulateProgress, 200);

    try {
      const result = await syncDatabase();
      clearInterval(progressInterval);
      setSyncProgress(100);

      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgress(0);

        if (result.success) {
          toast({
            title: "Sincronización exitosa",
            description: result.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error(result.message);
        }
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setIsSyncing(false);
      setSyncProgress(0);

      toast({
        title: "Error en la sincronización",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Personalización de la Tienda</Heading>
      <Tabs colorScheme="blue" variant="enclosed-colored">
        <TabList mb={4}>
          <Tab>
            <FaCog /> General
          </Tab>
          <Tab>
            <FaPalette /> Diseño
          </Tab>
          <Tab>
            <FaBoxOpen /> Productos
          </Tab>
          <Tab>
            <FaList /> Footer
          </Tab>
          <Tab>
            <FaHome /> Landing Page
          </Tab>
        </TabList>

        <AnimatePresence mode="wait">
          <TabPanels>
            <TabPanel>
              <MotionBox
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <GeneralTab
                  localConfig={localConfig}
                  setLocalConfig={setLocalConfig}
                />
              </MotionBox>
            </TabPanel>

            <TabPanel>
              <MotionBox
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <DesignTab
                  localConfig={localConfig}
                  setLocalConfig={setLocalConfig}
                />
              </MotionBox>
            </TabPanel>

            <TabPanel>
              <MotionBox
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ProductTab
                  handleDeleteProduct={handleDeleteProduct}
                  products={products}
                />
              </MotionBox>
            </TabPanel>

            <TabPanel>
              <MotionBox
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FooterTab
                  footerConfig={localConfig.footer}
                  onFooterConfigChange={handleFooterConfigChange}
                />
              </MotionBox>
            </TabPanel>

            <TabPanel>
              <MotionBox
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <LandingPageTab
                  landingPageConfig={localConfig.landingPage}
                  onLandingPageConfigChange={handleLandingPageConfigChange}
                />
              </MotionBox>
            </TabPanel>
          </TabPanels>
        </AnimatePresence>
      </Tabs>

      <Box mt={8}>
        <HStack spacing={4}>
          <CustomButton colorScheme="blue" size="lg" onClick={handleSaveConfig}>
            Guardar y Sincronizar Cambios
          </CustomButton>
          <CustomButton
            leftIcon={
              isSyncing ? (
                <CircularProgress
                  size="24px"
                  isIndeterminate
                  color="green.300"
                />
              ) : (
                <FaSync />
              )
            }
            colorScheme="green"
            size="lg"
            onClick={handleSyncDatabase}
            isDisabled={isSyncing}
          >
            {isSyncing ? (
              <HStack>
                <span>Sincronizando</span>
                <CircularProgress
                  value={syncProgress}
                  color="green.500"
                  size="32px"
                  thickness="16px"
                >
                  <CircularProgressLabel>
                    {Math.round(syncProgress)}%
                  </CircularProgressLabel>
                </CircularProgress>
              </HStack>
            ) : (
              "Sincronizar Base de Datos"
            )}
          </CustomButton>
        </HStack>
      </Box>
    </Container>
  );
};

export default CustomizationDashboard;
