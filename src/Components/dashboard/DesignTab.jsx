import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  VStack,
  Text,
  Button,
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
  useToast,
} from "@chakra-ui/react";
import { FaPalette, FaFont, FaSquare, FaUndo } from "react-icons/fa";
import ColorPicker from "./ColorPicker";
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
      <Button
        leftIcon={<FaUndo />}
        mt={4}
        onClick={() => handleReset("Colores")}
      >
        Restablecer Colores
      </Button>
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
            value={localConfig.baseFontSize}
            onChange={handleFontSizeChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
          <Text textAlign="center" mt={2}>
            {localConfig.baseFontSize}px
          </Text>
        </Box>
      </VStack>
      <Button
        leftIcon={<FaUndo />}
        mt={4}
        onClick={() => handleReset("Tipografía")}
      >
        Restablecer Tipografía
      </Button>
    </TabPanel>
  )
);

const ButtonTab = React.memo(
  ({ localConfig, handleColorChange, handleOpacityChange, handleReset }) => (
    <TabPanel>
      <VStack spacing={6} align="stretch">
        <ColorPicker
          color={localConfig.buttonColor}
          onChange={(color) => handleColorChange("buttonColor", color)}
          label="Color de Botón"
        />
        <ColorPicker
          color={localConfig.buttonTextColor}
          onChange={(color) => handleColorChange("buttonTextColor", color)}
          label="Color de Texto de Botón"
        />
        <Box>
          <Text fontWeight="bold" mb={2}>
            Opacidad del Hover
          </Text>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={localConfig.buttonHoverOpacity}
            onChange={handleOpacityChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
          <Text textAlign="center" mt={2}>
            {localConfig.buttonHoverOpacity.toFixed(1)}
          </Text>
        </Box>
      </VStack>
      <Button
        leftIcon={<FaUndo />}
        mt={4}
        onClick={() => handleReset("Botones")}
      >
        Restablecer Botones
      </Button>
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
      setLocalConfig((prev) => ({ ...prev, baseFontSize: value }));
    },
    [setLocalConfig]
  );

  const handleOpacityChange = useCallback(
    (value) => {
      setLocalConfig((prev) => ({ ...prev, buttonHoverOpacity: value }));
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
      fontSize: `${localConfig.baseFontSize}px`,
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
            handleReset={handleReset}
          />
        </TabPanels>
      </Tabs>
      <Box mt={6}>
        <Button
          leftIcon={<FaUndo />}
          colorScheme="red"
          onClick={() => handleReset()}
        >
          Restablecer Todos los Estilos
        </Button>
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
          <Button
            bg={localConfig.buttonColor}
            color={localConfig.buttonTextColor}
            _hover={{ opacity: localConfig.buttonHoverOpacity }}
          >
            Botón de Ejemplo
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

DesignTab.propTypes = {
  localConfig: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    headerColor: PropTypes.string.isRequired,
    headerTextColor: PropTypes.string.isRequired,
    primaryColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired,
    buttonColor: PropTypes.string.isRequired,
    buttonTextColor: PropTypes.string.isRequired,
    buttonHoverOpacity: PropTypes.number.isRequired,
    mainFont: PropTypes.string.isRequired,
    baseFontSize: PropTypes.number.isRequired,
    asideColor: PropTypes.string.isRequired,
  }).isRequired,
  setLocalConfig: PropTypes.func.isRequired,
};

ColorTab.displayName = "ColorTab";
FontTab.displayName = "FontTab";
ButtonTab.displayName = "ButtonTab";

export default React.memo(DesignTab);
