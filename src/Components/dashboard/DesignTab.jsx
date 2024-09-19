import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
} from "@chakra-ui/react";
import { SketchPicker } from "react-color";
import { FaFont, FaPalette, FaSquare } from "react-icons/fa";

const ColorPicker = ({ color, onChange, label }) => (
  <Popover>
    <PopoverTrigger>
      <Button height="40px" width="100%" bg={color}>
        {label}: {color}
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverBody>
        <SketchPicker color={color} onChange={(color) => onChange(color.hex)} />
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

const DesignTab = ({ localConfig, setLocalConfig }) => {
  const [activeTab, setActiveTab] = useState(0);
  const bgColor = useColorModeValue("white", "gray.800");
  const { colorMode } = useColorMode();

  const handleColorChange = (colorType, color) => {
    setLocalConfig((prev) => ({ ...prev, [colorType]: color }));
  };

  const handleFontChange = (e) => {
    setLocalConfig((prev) => ({ ...prev, mainFont: e.target.value }));
  };

  const handleFontSizeChange = (value) => {
    setLocalConfig((prev) => ({ ...prev, baseFontSize: value }));
  };

  const previewStyles = {
    fontFamily: localConfig.mainFont,
    fontSize: `${localConfig.baseFontSize}px`,
    color:
      colorMode === "dark"
        ? localConfig.darkModePrimaryColor
        : localConfig.primaryColor,
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
      <Tabs index={activeTab} onChange={setActiveTab} colorScheme="blue">
        <TabList>
          <Tab>
            <FaFont /> Tipografía
          </Tab>
          <Tab>
            <FaPalette /> Colores
          </Tab>
          <Tab>
            <FaSquare /> Botones
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Fuente Principal
                </Text>
                <Select
                  value={localConfig.mainFont}
                  onChange={handleFontChange}
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', serif">
                    Times New Roman
                  </option>
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
              <Box borderWidth={1} p={4} borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Vista previa
                </Text>
                <VStack align="start" spacing={2} style={previewStyles}>
                  <Text fontSize="2xl" fontWeight="bold">
                    Título Principal
                  </Text>
                  <Text fontSize="xl">Subtítulo</Text>
                  <Text>Texto de párrafo normal</Text>
                  <Text fontSize="sm">Texto pequeño</Text>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={2} spacing={6}>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Color Primario (Modo Claro)
                </Text>
                <ColorPicker
                  color={localConfig.primaryColor}
                  onChange={(color) => handleColorChange("primaryColor", color)}
                  label="Claro"
                />
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Color Primario (Modo Oscuro)
                </Text>
                <ColorPicker
                  color={localConfig.darkModePrimaryColor}
                  onChange={(color) =>
                    handleColorChange("darkModePrimaryColor", color)
                  }
                  label="Oscuro"
                />
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Color Secundario (Modo Claro)
                </Text>
                <ColorPicker
                  color={localConfig.secondaryColor}
                  onChange={(color) =>
                    handleColorChange("secondaryColor", color)
                  }
                  label="Claro"
                />
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Color Secundario (Modo Oscuro)
                </Text>
                <ColorPicker
                  color={localConfig.darkModeSecondaryColor}
                  onChange={(color) =>
                    handleColorChange("darkModeSecondaryColor", color)
                  }
                  label="Oscuro"
                />
              </Box>
            </SimpleGrid>
            <Box mt={6}>
              <Text fontWeight="bold" mb={2}>
                Paleta de Colores
              </Text>
              <SimpleGrid columns={7} spacing={2}>
                {[
                  "#805AD5",
                  "#3182CE",
                  "#D53F8C",
                  "#E53E3E",
                  "#DD6B20",
                  "#38A169",
                  "#319795",
                ].map((color) => (
                  <Button
                    key={color}
                    bg={color}
                    height="40px"
                    onClick={() => {
                      handleColorChange("secondaryColor", color);
                      handleColorChange("darkModeSecondaryColor", color);
                    }}
                  />
                ))}
              </SimpleGrid>
            </Box>
            <Box mt={6} borderWidth={1} p={4} borderRadius="md">
              <Text fontWeight="bold" mb={2}>
                Vista previa (Modo actual: {colorMode})
              </Text>
              <HStack spacing={4}>
                <Box
                  bg={
                    colorMode === "dark"
                      ? localConfig.darkModePrimaryColor
                      : localConfig.primaryColor
                  }
                  p={4}
                  borderRadius="md"
                >
                  <Text color="white">Color Primario</Text>
                </Box>
                <Box
                  bg={
                    colorMode === "dark"
                      ? localConfig.darkModeSecondaryColor
                      : localConfig.secondaryColor
                  }
                  p={4}
                  borderRadius="md"
                >
                  <Text color="white">Color Secundario</Text>
                </Box>
              </HStack>
            </Box>
          </TabPanel>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Color de Botón (Modo Claro)
                </Text>
                <ColorPicker
                  color={localConfig.buttonColor}
                  onChange={(color) => handleColorChange("buttonColor", color)}
                  label="Claro"
                />
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Color de Botón (Modo Oscuro)
                </Text>
                <ColorPicker
                  color={localConfig.darkModeButtonColor}
                  onChange={(color) =>
                    handleColorChange("darkModeButtonColor", color)
                  }
                  label="Oscuro"
                />
              </Box>
              <Box borderWidth={1} p={4} borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Vista previa de Botones (Modo actual: {colorMode})
                </Text>
                <HStack spacing={4}>
                  <Button
                    bg={
                      colorMode === "dark"
                        ? localConfig.darkModeButtonColor
                        : localConfig.buttonColor
                    }
                    color="white"
                  >
                    Botón Principal
                  </Button>
                  <Button
                    variant="outline"
                    borderColor={
                      colorMode === "dark"
                        ? localConfig.darkModeButtonColor
                        : localConfig.buttonColor
                    }
                    color={
                      colorMode === "dark"
                        ? localConfig.darkModeButtonColor
                        : localConfig.buttonColor
                    }
                  >
                    Botón Secundario
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

DesignTab.propTypes = {
  localConfig: PropTypes.shape({
    mainFont: PropTypes.string.isRequired,
    baseFontSize: PropTypes.number.isRequired,
    primaryColor: PropTypes.string.isRequired,
    darkModePrimaryColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired,
    darkModeSecondaryColor: PropTypes.string.isRequired,
    buttonColor: PropTypes.string.isRequired,
    darkModeButtonColor: PropTypes.string.isRequired,
  }).isRequired,
  setLocalConfig: PropTypes.func.isRequired,
};

export default DesignTab;
