import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Button,
  useColorModeValue,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Container,
  Heading,
} from "@chakra-ui/react";
import { FaStore, FaCog, FaPalette, FaBoxOpen, FaSync } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import DesignTab from "./DesignTab";
import { GeneralTab } from "./GeneralTab";
import { ProductTab } from "./ProductTab";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import useProductStore from "../../store/useProductStore";

const MotionBox = motion(Box);

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const CustomizationDashboard = () => {
  const navigate = useNavigate();
  const { config, setConfig, saveConfigToBackend, syncConfig } =
    useStoreConfigStore();
  const [localConfig, setLocalConfig] = useState(config);
  const { products, deleteProduct } = useProductStore();
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headerBgColor = useColorModeValue("white", "gray.800");

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
        "Todos los cambios han sido guardados y sincronizados exitosamente.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [localConfig, setConfig, saveConfigToBackend, toast]);

  const handleSyncConfig = useCallback(async () => {
    await syncConfig();
    toast({
      title: "Configuración sincronizada",
      description: "La configuración ha sido sincronizada con el servidor.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  }, [syncConfig, toast]);

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

  return (
    <Box bg={bgColor} minH="100vh">
      <Box bg={headerBgColor} py={4} px={8} boxShadow="sm">
        <Flex justifyContent="space-between" alignItems="center">
          <HStack spacing={4}>
            <Image
              src={localConfig.logo}
              alt="Logo"
              boxSize="40px"
              objectFit="contain"
            />
            <Heading as="h1" size="lg">
              {localConfig.title || "Mi Tienda"}
            </Heading>
          </HStack>
          <HStack>
            <Button
              leftIcon={<FaSync />}
              colorScheme="teal"
              onClick={handleSyncConfig}
            >
              Sincronizar
            </Button>
            <Button
              leftIcon={<FaStore />}
              colorScheme="blue"
              onClick={() => navigate("/")}
            >
              Ver Tienda
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Container maxW="container.xl" py={8}>
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
            </TabPanels>
          </AnimatePresence>
        </Tabs>

        <Flex justifyContent="flex-end" mt={8}>
          <Button colorScheme="blue" size="lg" onClick={handleSaveConfig}>
            Guardar y Sincronizar Cambios
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default CustomizationDashboard;
