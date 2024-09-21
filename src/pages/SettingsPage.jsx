import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import useStoreConfigStore from "../store/useStoreConfigStore";

const SettingsPage = () => {
  const { config, setConfig } = useStoreConfigStore();
  const [localConfig, setLocalConfig] = useState(config);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfig(localConfig);
    toast({
      title: "Configuración guardada",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxWidth="600px" margin="auto" mt={8} p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>Configuración</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel htmlFor="language">Idioma</FormLabel>
              <Select
                id="language"
                name="language"
                value={localConfig.language}
                onChange={handleChange}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="currency">Moneda</FormLabel>
              <Select
                id="currency"
                name="currency"
                value={localConfig.currency}
                onChange={handleChange}
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
              </Select>
            </FormControl>
            <Button type="submit" colorScheme="blue">
              Guardar Configuración
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default SettingsPage;