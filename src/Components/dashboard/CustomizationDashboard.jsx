// src/Components/dashboard/CustomizationDashboard.jsx
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
  Button,
  useToast,
} from "@chakra-ui/react";
import { FaCog, FaPalette, FaBoxOpen } from "react-icons/fa";
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
  const { config, setConfig, saveConfigToBackend, syncConfig } =
    useStoreConfigStore();
  const [localConfig, setLocalConfig] = useState(config);
  const { products, deleteProduct } = useProductStore();
  const toast = useToast();

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

      <Box mt={8}>
        <Button colorScheme="blue" size="lg" onClick={handleSaveConfig}>
          Guardar y Sincronizar Cambios
        </Button>
      </Box>
    </Container>
  );
};

export default CustomizationDashboard;
