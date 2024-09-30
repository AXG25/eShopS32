import React, { useCallback, useMemo } from "react";
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
} from "@chakra-ui/react";
import { FaPalette, FaFont, FaSquare, FaUndo } from "react-icons/fa";
import ColorPicker from "./ColorPicker";
import CustomButton from "../common/CustomButton";
import useStoreConfigStore from "../../store/useStoreConfigStore";

const ColorTab = React.memo(
  ({ localConfig, handleColorChange, handleReset }) => (
    <TabPanel>
      <SimpleGrid columns={2} spacing={6}>
        {Object.entries(localConfig)
          .filter(([key]) => key.includes("Color"))
          .map(([key, value]) => (
            <ColorPicker
              key={key}
              color={value}
              onChange={(color) => handleColorChange(key, color)}
              label={key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            />
          ))}
      </SimpleGrid>
      <CustomButton
        leftIcon={<FaUndo />}
        mt={4}
        onClick={() => handleReset("Colores")}
      >
        Restablecer Colores
      </CustomButton>
    </TabPanel>
  )
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
}) => (
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
          color={
            localConfig[`${sectionName}ButtonColor`] || localConfig.buttonColor
          }
          onChange={(color) =>
            handleColorChange(`${sectionName}ButtonColor`, color)
          }
          label={`Color de Botón (${sectionName})`}
        />
        <ColorPicker
          color={
            localConfig[`${sectionName}ButtonTextColor`] ||
            localConfig.buttonTextColor
          }
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
            value={
              localConfig[`${sectionName}ButtonHoverOpacity`] ||
              localConfig.buttonHoverOpacity
            }
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
            value={
              localConfig[`${sectionName}ButtonFontSize`] ||
              localConfig.buttonFontSize
            }
            onChange={(e) =>
              handleInputChange(`${sectionName}ButtonFontSize`, e.target.value)
            }
            placeholder="ej: 16px"
          />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            Radio de Borde del Botón ({sectionName})
          </Text>
          <Input
            value={
              localConfig[`${sectionName}ButtonBorderRadius`] ||
              localConfig.buttonBorderRadius
            }
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
        <ButtonSectionTab
          sectionName="general"
          localConfig={localConfig}
          handleColorChange={handleColorChange}
          handleOpacityChange={handleOpacityChange}
          handleInputChange={handleInputChange}
        />
        <ButtonSectionTab
          sectionName="header"
          localConfig={localConfig}
          handleColorChange={handleColorChange}
          handleOpacityChange={handleOpacityChange}
          handleInputChange={handleInputChange}
        />
        <ButtonSectionTab
          sectionName="productCard"
          localConfig={localConfig}
          handleColorChange={handleColorChange}
          handleOpacityChange={handleOpacityChange}
          handleInputChange={handleInputChange}
        />
        <ButtonSectionTab
          sectionName="cart"
          localConfig={localConfig}
          handleColorChange={handleColorChange}
          handleOpacityChange={handleOpacityChange}
          handleInputChange={handleInputChange}
        />
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
  const resetConfig = useStoreConfigStore((state) => state.resetConfig);
  const toast = useToast();

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
            <FaPalette /> Colores
          </Tab>
          <Tab>
            <FaFont /> Tipografía
          </Tab>
          <Tab>
            <FaSquare /> Botones
          </Tab>
        </TabList>
        <TabPanels>
          <ColorTab
            localConfig={localConfig}
            handleColorChange={handleColorChange}
            handleReset={handleReset}
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
      <Box mt={6}>
        <CustomButton
          leftIcon={<FaUndo />}
          colorScheme="red"
          onClick={() => handleReset()}
        >
          Restablecer Todos los Estilos
        </CustomButton>
      </Box>
      <Box mt={6} borderWidth={1} p={4} borderRadius="md">
        <Text fontWeight="bold" mb={2}>
          Vista previa
        </Text>
        <VStack align="start" spacing={2} style={previewStyle}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            style={{ color: localConfig.headerTextColor }}
          >
            Título Principal
          </Text>
          <Text fontSize="xl">Subtítulo</Text>
          <Text>Texto de párrafo normal</Text>
          <Text fontSize="sm">Texto pequeño</Text>
          <HStack spacing={2}>
            <CustomButton>Botón General</CustomButton>
            <CustomButton config={localConfig.header}>
              Botón Header
            </CustomButton>
            <CustomButton config={localConfig.productCard}>
              Botón Producto
            </CustomButton>
            <CustomButton config={localConfig.cart}>Botón Carrito</CustomButton>
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
