import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Image,
  useColorModeValue,
  Divider,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaStore, FaLanguage, FaUpload } from "react-icons/fa";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import PropTypes from "prop-types";

/**
 * GeneralTab - Componente para la configuración general de la tienda
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.localConfig - Configuración local de la tienda
 * @param {Function} props.setLocalConfig - Función para actualizar la configuración local
 */

export const GeneralTab = ({ localConfig, setLocalConfig }) => {
  const { t, i18n } = useTranslation();
  const { config } = useStoreConfigStore();

  const [previewLanguage, setPreviewLanguage] = useState(config.language);
  const bgColor = useColorModeValue("white", "gray.700");
  const sectionBgColor = useColorModeValue("gray.50", "gray.600");

  // Manejo de carga de imagen para el logo
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalConfig((prev) => ({ ...prev, logo: event.target.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxFiles: 1,
  });

  // Manejadores de cambios en la configuración
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setLocalConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setPreviewLanguage(newLanguage);
    setLocalConfig((prev) => ({ ...prev, language: newLanguage }));
  };

  // Efecto para cambiar el idioma temporalmente para previsualización
  useEffect(() => {
    i18n.changeLanguage(previewLanguage);

    return () => {
      i18n.changeLanguage(config.language);
    };
  }, [previewLanguage, config.language, i18n]);

  /* const handleDarkModeChange = useCallback((e) => {
    const newDarkMode = e.target.checked;
    setLocalConfig((prev) => ({ ...prev, darkMode: newDarkMode }));
  }, []); */

  return (
    <VStack
      spacing={6}
      align="stretch"
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
    >
      <Box>
        <HStack mb={4}>
          <FaStore size="24px" />
          <Heading as="h2" size="lg">
            {t("store.information")}
          </Heading>
        </HStack>
        <VStack
          spacing={4}
          align="stretch"
          bg={sectionBgColor}
          p={4}
          borderRadius="md"
        >
          <Box>
            <Text fontWeight="semibold" mb={2}>
              {t("store.title")}
            </Text>
            <Input
              name="title"
              value={localConfig.title}
              onChange={handleConfigChange}
              placeholder={t("store.enterTitle")}
            />
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2}>
              {t("store.description")}
            </Text>
            <Input
              name="description"
              value={localConfig.description}
              onChange={handleConfigChange}
              placeholder={t("store.enterDescription")}
            />
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2}>
              {t("store.logo")}
            </Text>
            <Tooltip label={t("ui.dragAndDropImage")}>
              <Box
                {...getRootProps()}
                border="2px dashed"
                borderColor={isDragActive ? "blue.500" : "gray.300"}
                borderRadius="md"
                p={4}
                textAlign="center"
                cursor="pointer"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <Text>{t("ui.dropImageHere")}</Text>
                ) : (
                  <HStack justify="center">
                    <FaUpload />
                    <Text>{t("store.uploadLogo")}</Text>
                  </HStack>
                )}
              </Box>
            </Tooltip>
            {localConfig.logo && (
              <Image
                src={localConfig.logo}
                alt={t("store.logoPreview")}
                maxH="100px"
                mt={2}
              />
            )}
          </Box>
        </VStack>
      </Box>

      <Divider />

      <Box>
        <HStack mb={4}>
          <FaLanguage size="24px" />
          <Heading as="h2" size="lg">
            {t("store.language")}
          </Heading>
        </HStack>
        <VStack
          spacing={4}
          align="stretch"
          bg={sectionBgColor}
          p={4}
          borderRadius="md"
        >
          <Box>
            <Text fontWeight="semibold" mb={2}>
              {t("store.mainLanguage")}
            </Text>
            <Select
              name="language"
              value={previewLanguage}
              onChange={handleLanguageChange}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </Select>
          </Box>
          {/* <Box>
            <Text fontWeight="semibold" mb={2}>
              {t("currency")}
            </Text>
            <Select
              name="currency"
              value={localConfig.currency}
              onChange={handleConfigChange}
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="GBP">British Pound (£)</option>
            </Select>
          </Box> */}
        </VStack>
      </Box>
    </VStack>
  );
};

GeneralTab.propTypes = {
  localConfig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logo: PropTypes.string,
    language: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    darkMode: PropTypes.bool.isRequired,
  }).isRequired,
  setLocalConfig: PropTypes.func.isRequired,
};

export default GeneralTab;