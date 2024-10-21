/* eslint-disable no-unused-vars */
import { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  VStack,
  Text,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ColorPicker from "../dashboard/ColorPicker";
import CustomButton from "./CustomButton";

const parseGradient = (gradientString) => {
  const match = gradientString.match(/(\w+)\((.*?)\)/);
  if (match) {
    const [_, type, rest] = match;
    const parts = rest.split(",").map((part) => part.trim());

    if (type === "linear") {
      const [direction, color1, color2] = parts;
      return { type: "linear", direction, color1, color2 };
    } else if (type === "radial") {
      const [shape, extent, color1, color2] = parts;
      return { type: "radial", shape, extent, color1, color2 };
    } else if (type === "conic") {
      const [angle, color1, color2] = parts;
      const degree = angle.match(/from\s+(\d+)deg/)[1];
      return { type: "conic", degree, color1, color2 };
    }
  }
  return null;
};

const GradientGenerator = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [gradientType, setGradientType] = useState("linear");
  const [linearDirection, setLinearDirection] = useState("to-r");
  const [radialShape, setRadialShape] = useState("circle");
  const [radialExtent, setRadialExtent] = useState("farthest-corner");
  const [conicDegree, setConicDegree] = useState(0);
  const [color1, setColor1] = useState("#0d9488");
  const [color2, setColor2] = useState("#3b82f6");

  useEffect(() => {
    const parsedGradient = parseGradient(value);
    if (parsedGradient) {
      setGradientType(parsedGradient.type);
      setColor1(parsedGradient.color1);
      setColor2(parsedGradient.color2);

      if (parsedGradient.type === "linear") {
        setLinearDirection(parsedGradient.direction);
      } else if (parsedGradient.type === "radial") {
        setRadialShape(parsedGradient.shape);
        setRadialExtent(parsedGradient.extent);
      } else if (parsedGradient.type === "conic") {
        setConicDegree(parseInt(parsedGradient.degree));
      }
    }
  }, [value]);

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const currentGradient = useMemo(() => {
    switch (gradientType) {
      case "linear":
        return `linear(${linearDirection}, ${color1}, ${color2})`;
      case "radial":
        return `radial(${radialShape} ${radialExtent}, ${color1}, ${color2})`;
      case "conic":
        return `conic(from ${conicDegree}deg, ${color1}, ${color2})`;
      default:
        return value;
    }
  }, [
    gradientType,
    linearDirection,
    radialShape,
    radialExtent,
    conicDegree,
    color1,
    color2,
    value,
  ]);

  const applyGradient = useCallback(() => {
    // Actualizar solo la parte del gradiente en el valor original
    const updatedValue = value.replace(/(\w+)\(.*?\)/, currentGradient);
    onChange(updatedValue);
  }, [currentGradient, onChange, value]);

  const gradientContent = (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>{t("gradientGenerator.type")}</FormLabel>
        <Select
          value={gradientType}
          onChange={(e) => setGradientType(e.target.value)}
        >
          <option value="linear">{t("gradientGenerator.linear")}</option>
          <option value="radial">{t("gradientGenerator.radial")}</option>
          <option value="conic">{t("gradientGenerator.conic")}</option>
        </Select>
      </FormControl>

      {gradientType === "linear" && (
        <FormControl>
          <FormLabel>{t("gradientGenerator.direction")}</FormLabel>
          <Select
            value={linearDirection}
            onChange={(e) => setLinearDirection(e.target.value)}
          >
            <option value="to-t">{t("gradientGenerator.toTop")}</option>
            <option value="to-tr">{t("gradientGenerator.toTopRight")}</option>
            <option value="to-r">{t("gradientGenerator.toRight")}</option>
            <option value="to-br">
              {t("gradientGenerator.toBottomRight")}
            </option>
            <option value="to-b">{t("gradientGenerator.toBottom")}</option>
            <option value="to-bl">{t("gradientGenerator.toBottomLeft")}</option>
            <option value="to-l">{t("gradientGenerator.toLeft")}</option>
            <option value="to-tl">{t("gradientGenerator.toTopLeft")}</option>
          </Select>
        </FormControl>
      )}

      {gradientType === "radial" && (
        <>
          <FormControl>
            <FormLabel>{t("gradientGenerator.shape")}</FormLabel>
            <Select
              value={radialShape}
              onChange={(e) => setRadialShape(e.target.value)}
            >
              <option value="circle">{t("gradientGenerator.circle")}</option>
              <option value="ellipse">{t("gradientGenerator.ellipse")}</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t("gradientGenerator.extent")}</FormLabel>
            <Select
              value={radialExtent}
              onChange={(e) => setRadialExtent(e.target.value)}
            >
              <option value="closest-side">
                {t("gradientGenerator.closestSide")}
              </option>
              <option value="closest-corner">
                {t("gradientGenerator.closestCorner")}
              </option>
              <option value="farthest-side">
                {t("gradientGenerator.farthestSide")}
              </option>
              <option value="farthest-corner">
                {t("gradientGenerator.farthestCorner")}
              </option>
            </Select>
          </FormControl>
        </>
      )}

      {gradientType === "conic" && (
        <FormControl>
          <FormLabel>{t("gradientGenerator.angle")}</FormLabel>
          <Input
            type="number"
            value={conicDegree}
            onChange={(e) => setConicDegree(Number(e.target.value))}
            min={0}
            max={360}
          />
        </FormControl>
      )}

      <Flex direction="column" gap={2}>
        <FormControl>
          <FormLabel>{t("gradientGenerator.color1")}</FormLabel>
          <ColorPicker color={color1} onChange={setColor1} />
        </FormControl>
        <FormControl>
          <FormLabel>{t("gradientGenerator.color2")}</FormLabel>
          <ColorPicker color={color2} onChange={setColor2} />
        </FormControl>
      </Flex>

      <Box height="40px" borderRadius="md" bgGradient={currentGradient} />

      <CustomButton onClick={applyGradient}>
        {t("gradientGenerator.apply")}
      </CustomButton>
    </VStack>
  );

  return (
    <Popover placement="bottom" closeOnBlur={false}>
      <PopoverTrigger>
        <Box
          cursor="pointer"
          borderWidth={1}
          borderRadius="md"
          p={2}
          bgGradient={value}
          _hover={{ boxShadow: "md" }}
        >
          <Text fontSize="sm" color={textColor}>
            {t("gradientGenerator.clickToEdit")}
          </Text>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        bg={bgColor}
        borderColor="gray.200"
        boxShadow="xl"
        width="300px"
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold">
          {t("gradientGenerator.editGradient")}
        </PopoverHeader>
        <PopoverBody>{gradientContent}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

GradientGenerator.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default GradientGenerator;
