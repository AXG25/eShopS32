import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  VStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Select,
  Input,
  useToast,
  HStack,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Accordion,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaPalette,
  FaFont,
  FaSquare,
  FaUndo,
  FaInfoCircle,
} from "react-icons/fa";
import ColorPicker from "./ColorPicker";
import CustomButton from "../common/CustomButton";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import { useTranslation } from "react-i18next";

const ColorTab = React.memo(
  ({ localConfig, handleColorChange, handleReset, handleResetColors }) => {
    const { t } = useTranslation();
    return (
      <TabPanel>
        <SimpleGrid columns={2} spacing={6}>
          {/* <ColorPicker
            color={localConfig.backgroundColor}
            onChange={(color) => handleColorChange("backgroundColor", color)}
            label={t("design.backgroundColor")}
          />
          <ColorPicker
            color={localConfig.headerColor}
            onChange={(color) => handleColorChange("headerColor", color)}
            label={t("design.headerColor")}
          /> */}
          <ColorPicker
            color={localConfig.headerTextColor}
            onChange={(color) => handleColorChange("headerTextColor", color)}
            label={t("design.headerTextColor")}
          />
          {/* <ColorPicker
            color={localConfig.textColor}
            onChange={(color) => handleColorChange("textColor", color)}
            label={t("design.textColor")}
          /> */}
          <ColorPicker
            color={localConfig.primaryColor}
            onChange={(color) => handleColorChange("primaryColor", color)}
            label={t("design.primaryColor")}
          />
          {/* <ColorPicker
            color={localConfig.secondaryColor}
            onChange={(color) => handleColorChange("secondaryColor", color)}
            label={t("design.secondaryColor")}
          /> */}
          <ColorPicker
            color={localConfig.buttonColor}
            onChange={(color) => handleColorChange("buttonColor", color)}
            label={t("design.buttonColor")}
          />
          <ColorPicker
            color={localConfig.buttonTextColor}
            onChange={(color) => handleColorChange("buttonTextColor", color)}
            label={t("design.buttonTextColor")}
          />
          {/* <ColorPicker
            color={localConfig.asideColor}
            onChange={(color) => handleColorChange("asideColor", color)}
            label={t("design.asideColor")}
          /> */}
        </SimpleGrid>
        <CustomButton
          leftIcon={<FaUndo />}
          mt={4}
          onClick={() => handleResetColors()}
        >
          {t("design.resetColors")}
        </CustomButton>
      </TabPanel>
    );
  }
);

const FontTab = React.memo(
  ({ localConfig, handleFontChange, handleFontSizeChange, handleReset }) => (
    <TabPanel>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={2}>
            Fuente Principal
          </Text>
          <Select value={localConfig.mainFont} onChange={handleFontChange}>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
          </Select>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            Tamaño de Fuente Base
          </Text>
          <Slider
            min={12}
            max={24}
            step={1}
            value={parseInt(localConfig.baseFontSize)}
            onChange={handleFontSizeChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
          <Text textAlign="center" mt={2}>
            {localConfig.baseFontSize}
          </Text>
        </Box>
      </VStack>
      <CustomButton
        leftIcon={<FaUndo />}
        mt={4}
        onClick={() => handleReset("Tipografía")}
      >
        Restablecer Tipografía
      </CustomButton>
    </TabPanel>
  )
);

const ButtonSectionTab = ({
  sectionName,
  localConfig,
  handleColorChange,
  handleOpacityChange,
  handleInputChange,
}) => {
  // Función para obtener el valor específico de la sección o el valor general si no existe
  const getConfigValue = (key) => {
    const sectionKey = `${sectionName}${
      key.charAt(0).toUpperCase() + key.slice(1)
    }`;
    return localConfig[sectionKey] || localConfig[key];
  };

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {sectionName}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <VStack spacing={4} align="stretch">
          <ColorPicker
            color={getConfigValue("buttonColor")}
            onChange={(color) =>
              handleColorChange(`${sectionName}ButtonColor`, color)
            }
            label={`Color de Botón (${sectionName})`}
          />
          <ColorPicker
            color={getConfigValue("buttonTextColor")}
            onChange={(color) =>
              handleColorChange(`${sectionName}ButtonTextColor`, color)
            }
            label={`Color de Texto de Botón (${sectionName})`}
          />
          <Box>
            <Text fontWeight="bold" mb={2}>
              Opacidad del Hover ({sectionName})
            </Text>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={getConfigValue("buttonHoverOpacity")}
              onChange={(value) =>
                handleOpacityChange(`${sectionName}ButtonHoverOpacity`, value)
              }
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={2}>
              Tamaño de Fuente del Botón ({sectionName})
            </Text>
            <Input
              value={getConfigValue("buttonFontSize")}
              onChange={(e) =>
                handleInputChange(
                  `${sectionName}ButtonFontSize`,
                  e.target.value
                )
              }
              placeholder="ej: 16px"
            />
          </Box>
          <Box>
            <Text fontWeight="bold" mb={2}>
              Radio de Borde del Botón ({sectionName})
            </Text>
            <Input
              value={getConfigValue("buttonBorderRadius")}
              onChange={(e) =>
                handleInputChange(
                  `${sectionName}ButtonBorderRadius`,
                  e.target.value
                )
              }
              placeholder="ej: 4px"
            />
          </Box>
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

const ButtonTab = React.memo(
  ({
    localConfig,
    handleColorChange,
    handleOpacityChange,
    handleInputChange,
    handleReset,
  }) => (
    <TabPanel>
      <Accordion allowMultiple>
        {["general", "header", "productCard", "cart"].map((section) => (
          <ButtonSectionTab
            key={section}
            sectionName={section}
            localConfig={localConfig}
            handleColorChange={handleColorChange}
            handleOpacityChange={handleOpacityChange}
            handleInputChange={handleInputChange}
          />
        ))}
      </Accordion>
      <CustomButton
        leftIcon={<FaUndo />}
        mt={4}
        onClick={() => handleReset("Botones")}
      >
        Restablecer Botones
      </CustomButton>
    </TabPanel>
  )
);

const DesignTab = ({ localConfig, setLocalConfig }) => {
  const { t } = useTranslation();
  const resetConfig = useStoreConfigStore((state) => state.resetConfig);
  const toast = useToast();
  const [previewText, setPreviewText] = useState("Lorem ipsum dolor sit amet");

  const handlePreviewTextChange = (e) => {
    setPreviewText(e.target.value);
  };

  // Nuevo: Función para generar una paleta de colores complementarios
  const generateComplementaryPalette = () => {
    const baseColor = localConfig.primaryColor;
    // Aquí iría la lógica para generar colores complementarios
    // Por ahora, simplemente generamos colores aleatorios
    const complementaryColors = Array(4)
      .fill()
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16));

    setLocalConfig((prev) => ({
      ...prev,
      secondaryColor: complementaryColors[0],
      accentColor: complementaryColors[1],
      backgroundColor: complementaryColors[2],
      textColor: complementaryColors[3],
    }));

    toast({
      title: t("design.paletteGenerated"),
      status: "success",
      duration: 2000,
    });
  };

  const handleColorChange = useCallback(
    (colorType, color) => {
      setLocalConfig((prev) => ({ ...prev, [colorType]: color }));
    },
    [setLocalConfig]
  );

  const handleFontChange = useCallback(
    (e) => {
      setLocalConfig((prev) => ({ ...prev, mainFont: e.target.value }));
    },
    [setLocalConfig]
  );

  const handleFontSizeChange = useCallback(
    (value) => {
      setLocalConfig((prev) => ({ ...prev, baseFontSize: `${value}px` }));
    },
    [setLocalConfig]
  );

  const handleOpacityChange = useCallback(
    (key, value) => {
      setLocalConfig((prev) => ({ ...prev, [key]: value }));
    },
    [setLocalConfig]
  );

  const handleInputChange = useCallback(
    (key, value) => {
      setLocalConfig((prev) => ({ ...prev, [key]: value }));
    },
    [setLocalConfig]
  );

  

  const handleResetColors = useCallback(() => {
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      asideColor: "#F7FAFC",
      backgroundColor: "#FFFFFF",
      buttonColor: "#4299E1",
      buttonTextColor: "#FFFFFF",
      headerColor: "#FFFFFF",
      headerTextColor: "#000000",
      primaryColor: "#3182CE",
      secondaryColor: "#FFFFFF",
      textColor: "#333333",
    }));
  }, []);

  const handleReset = useCallback(
    (section) => {
      resetConfig();
      const newConfig = useStoreConfigStore.getState().config;
      setLocalConfig(newConfig);
      toast({
        title: `Estilos ${section ? `de ${section}` : ""} restablecidos`,
        description: `Se han restaurado los estilos ${
          section ? `de ${section}` : ""
        } por defecto`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    [resetConfig, setLocalConfig, toast]
  );

  const previewStyle = useMemo(
    () => ({
      fontFamily: localConfig.mainFont,
      fontSize: localConfig.baseFontSize,
      color: localConfig.textColor,
      backgroundColor: localConfig.backgroundColor,
      padding: "20px",
      borderRadius: "8px",
    }),
    [localConfig]
  );

  return (
    <Box p={6} borderRadius="lg" boxShadow="md">
      <Tabs colorScheme="blue">
        <TabList>
          <Tab>
            <FaPalette /> {t("design.colors")}
          </Tab>
         {/*  <Tab>
            <FaFont /> {t("design.typography")}
          </Tab>
          <Tab>
            <FaSquare /> {t("design.buttons")}
          </Tab> */}
        </TabList>
        <TabPanels>
          <ColorTab
            localConfig={localConfig}
            handleColorChange={handleColorChange}
            handleReset={handleReset}
            handleResetColors={handleResetColors}
          />
          <FontTab
            localConfig={localConfig}
            handleFontChange={handleFontChange}
            handleFontSizeChange={handleFontSizeChange}
            handleReset={handleReset}
          />
          <ButtonTab
            localConfig={localConfig}
            handleColorChange={handleColorChange}
            handleOpacityChange={handleOpacityChange}
            handleInputChange={handleInputChange}
            handleReset={handleReset}
          />
        </TabPanels>
      </Tabs>

      <HStack spacing={4} mt={6}>
        <CustomButton
          leftIcon={<FaPalette />}
          onClick={generateComplementaryPalette}
          colorScheme="teal"
        >
          {t("design.generatePalette")}
        </CustomButton>

        <CustomButton
          leftIcon={<FaUndo />}
          colorScheme="red"
          onClick={() => handleReset()}
        >
          {t("design.resetAllStyles")}
        </CustomButton>
      </HStack>

      <Box mt={6} borderWidth={1} p={4} borderRadius="md">
        <HStack justify="space-between" mb={2}>
          <Text fontWeight="bold">{t("design.preview")}</Text>
          <Tooltip label={t("design.previewTooltip")} hasArrow>
            <Box as={FaInfoCircle} />
          </Tooltip>
        </HStack>
        <Input
          value={previewText}
          onChange={handlePreviewTextChange}
          placeholder={t("design.enterPreviewText")}
          mb={4}
        />
        <VStack align="start" spacing={2} style={previewStyle}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            style={{ color: localConfig.headerTextColor }}
          >
            {previewText}
          </Text>
          <Text fontSize="xl">{previewText}</Text>
          <Text>{previewText}</Text>
          <Text fontSize="sm">{previewText}</Text>
          <HStack spacing={2}>
            <CustomButton>{t("design.generalButton")}</CustomButton>
            <CustomButton config={localConfig} section="header">
              {t("design.headerButton")}
            </CustomButton>
            <CustomButton config={localConfig} section="productCard">
              {t("design.productButton")}
            </CustomButton>
            <CustomButton config={localConfig} section="cart">
              {t("design.cartButton")}
            </CustomButton>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

DesignTab.propTypes = {
  localConfig: PropTypes.object.isRequired,
  setLocalConfig: PropTypes.func.isRequired,
};

ButtonSectionTab.propTypes = {
  sectionName: PropTypes.string.isRequired,
  localConfig: PropTypes.object.isRequired,
  handleColorChange: PropTypes.func.isRequired,
  handleOpacityChange: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

ButtonTab.propTypes = {
  localConfig: PropTypes.object.isRequired,
  handleColorChange: PropTypes.func.isRequired,
  handleOpacityChange: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
};

ColorTab.displayName = "ColorTab";
FontTab.displayName = "FontTab";
ButtonTab.displayName = "ButtonTab";

export default React.memo(DesignTab);
