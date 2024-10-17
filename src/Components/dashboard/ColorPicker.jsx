import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import CustomButton from "../common/CustomButton";

const SketchPicker = React.lazy(() =>
  import("react-color").then((module) => ({ default: module.SketchPicker }))
);

const getContrastColor = (hexColor) => {
  if (!hexColor || typeof hexColor !== "string" || hexColor.length !== 7) {
    return "#000000"; // Default to black if the input is invalid
  }
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const ColorPicker = React.memo(({ color, onChange, label }) => {
  const { colorMode } = useColorMode();
  const [localColor, setLocalColor] = useState(color || "#000000"); // Provide a default color
  const textColor = getContrastColor(localColor);

  const debouncedOnChange = useCallback(
    debounce((newColor) => {
      onChange(newColor);
    }, 200),
    [onChange]
  );

  useEffect(() => {
    setLocalColor(color || "#000000"); // Update local color when prop changes, with a default
  }, [color]);

  const handleChangeComplete = useCallback(
    (newColor) => {
      const hexColor = newColor.hex;
      setLocalColor(hexColor);
      debouncedOnChange(hexColor);
    },
    [debouncedOnChange]
  );

  return (
    <Popover>
      <PopoverTrigger>
        <CustomButton
          height="40px"
          width="100%"
          bg={localColor}
          color={textColor}
          borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
          borderWidth="1px"
          _hover={{
            borderColor: colorMode === "light" ? "gray.400" : "gray.500",
          }}
        >
          {label}: {localColor}
        </CustomButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <React.Suspense fallback={<div>Loading...</div>}>
            <SketchPicker color={localColor} onChange={handleChangeComplete} />
          </React.Suspense>
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
