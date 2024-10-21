import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
  Box,
  Flex,
  Input,
  VStack,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import CustomButton from "../common/CustomButton";
import { RgbaStringColorPicker } from "react-colorful";

const getContrastColor = (hexColor) => {
  if (!hexColor || typeof hexColor !== "string" || hexColor.length !== 7) {
    return "#000000";
  }
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const hexToRgba = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

const rgbaToHex = (rgba) => {
  const parts = rgba.substring(rgba.indexOf("(") + 1, rgba.lastIndexOf(")")).split(/,\s*/);
  const r = parseInt(parts[0]).toString(16).padStart(2, '0');
  const g = parseInt(parts[1]).toString(16).padStart(2, '0');
  const b = parseInt(parts[2]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

const ColorPicker = React.memo(({ color, onChange, label }) => {
  const { colorMode } = useColorMode();
  const [localColor, setLocalColor] = useState(hexToRgba(color || "#000000"));
  const textColor = getContrastColor(rgbaToHex(localColor));

  const debouncedOnChange = useCallback(
    debounce((newColor) => {
      onChange(rgbaToHex(newColor));
    }, 200),
    [onChange]
  );

  useEffect(() => {
    setLocalColor(hexToRgba(color || "#000000"));
  }, [color]);

  const handleChangeComplete = useCallback(
    (newColor) => {
      setLocalColor(newColor);
      debouncedOnChange(newColor);
    },
    [debouncedOnChange]
  );

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <CustomButton
          height="40px"
          width="100%"
          bg={rgbaToHex(localColor)}
          color={textColor}
          borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
          borderWidth="1px"
          _hover={{
            borderColor: colorMode === "light" ? "gray.400" : "gray.500",
          }}
        >
          {label}: {rgbaToHex(localColor)}
        </CustomButton>
      </PopoverTrigger>
      <PopoverContent width="240px">
        <PopoverBody>
          <VStack spacing={2}>
            <RgbaStringColorPicker color={localColor} onChange={handleChangeComplete} />
            <Flex width="100%">
              <Input
                value={rgbaToHex(localColor)}
                onChange={(e) => handleChangeComplete(hexToRgba(e.target.value))}
                size="sm"
              />
              <Box
                width="40px"
                height="32px"
                ml={2}
                borderRadius="md"
                bg={rgbaToHex(localColor)}
              />
            </Flex>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

ColorPicker.displayName = "ColorPicker";

ColorPicker.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default ColorPicker;