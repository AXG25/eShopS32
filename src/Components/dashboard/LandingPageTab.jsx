import React, { useState, useMemo, useCallback } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import CustomButton from "../common/CustomButton";
import ImageUpload from "../common/ImageUpload";
import ColorPicker from "./ColorPicker";
import IconSelect from "../common/IconSelect";
import GradientGenerator from "../common/GradientGenerator";

const LandingPageTab = ({ landingPageConfig, onLandingPageConfigChange }) => {
  const { t } = useTranslation();
  const [localConfig, setLocalConfig] = useState(landingPageConfig);

  const debouncedConfigChange = useCallback(
    debounce((newConfig) => {
      onLandingPageConfigChange(newConfig);
    }, 300),
    [onLandingPageConfigChange]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setLocalConfig((prev) => {
        const newConfig = { ...prev, [name]: value };
        debouncedConfigChange(newConfig);
        return newConfig;
      });
    },
    [debouncedConfigChange]
  );

  const handleColorChange = useCallback(
    (key, color) => {
      setLocalConfig((prev) => {
        const newConfig = { ...prev, [key]: color };
        debouncedConfigChange(newConfig);
        return newConfig;
      });
    },
    [debouncedConfigChange]
  );

  const handleFeatureChange = useCallback(
    (index, field, value) => {
      setLocalConfig((prev) => {
        const newFeatures = [...prev.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        const newConfig = { ...prev, features: newFeatures };
        debouncedConfigChange(newConfig);
        return newConfig;
      });
    },
    [debouncedConfigChange]
  );

  const addFeature = useCallback(() => {
    setLocalConfig((prev) => {
      const newConfig = {
        ...prev,
        features: [
          ...prev.features,
          { icon: "FaUser", title: "", description: "" },
        ],
      };
      debouncedConfigChange(newConfig);
      return newConfig;
    });
  }, [debouncedConfigChange]);

  const removeFeature = useCallback(
    (index) => {
      setLocalConfig((prev) => {
        const newConfig = {
          ...prev,
          features: prev.features.filter((_, i) => i !== index),
        };
        debouncedConfigChange(newConfig);
        return newConfig;
      });
    },
    [debouncedConfigChange]
  );

  const handleImageUpload = useCallback(
    (imageData) => {
      setLocalConfig((prev) => {
        const newConfig = { ...prev, heroImage: imageData };
        debouncedConfigChange(newConfig);
        return newConfig;
      });
    },
    [debouncedConfigChange]
  );

  const renderFeatures = useMemo(() => {
    return localConfig.features.map((feature, index) => (
      <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
        <Heading size="xs" mb={2}>
          {t("landingPageConfig.feature")} {index + 1}
        </Heading>
        <SimpleGrid columns={2} spacing={4}>
          <IconSelect
            value={feature.icon}
            onChange={(e) => handleFeatureChange(index, "icon", e.target.value)}
          />
          <FormControl>
            <FormLabel>{t("landingPageConfig.title")}</FormLabel>
            <Input
              value={feature.title}
              onChange={(e) =>
                handleFeatureChange(index, "title", e.target.value)
              }
            />
          </FormControl>
          <FormControl gridColumn="span 2">
            <FormLabel>{t("general.description")}</FormLabel>
            <Textarea
              value={feature.description}
              onChange={(e) =>
                handleFeatureChange(index, "description", e.target.value)
              }
            />
          </FormControl>
        </SimpleGrid>
        <CustomButton
          leftIcon={<FaTrash />}
          colorScheme="red"
          size="sm"
          mt={2}
          onClick={() => removeFeature(index)}
        >
          {t("landingPageConfig.removeFeature")}
        </CustomButton>
      </Box>
    ));
  }, [localConfig.features, handleFeatureChange, removeFeature, t]);

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">{t("landingPageConfig.titleConfig")}</Heading>

      <Box>
        <Heading size="sm" mb={4}>
          {t("landingPageConfig.heroSection")}
        </Heading>
        <SimpleGrid columns={2} spacing={4}>
          <FormControl>
            <FormLabel>{t("landingPageConfig.heroTitle")}</FormLabel>
            <Input
              name="heroTitle"
              value={localConfig.heroTitle}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("landingPageConfig.heroSubtitle")}</FormLabel>
            <Input
              name="heroSubtitle"
              value={localConfig.heroSubtitle}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("landingPageConfig.heroButtonText")}</FormLabel>
            <Input
              name="heroButtonText"
              value={localConfig.heroButtonText}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("landingPageConfig.heroButtonColor")}</FormLabel>
            <ColorPicker
              color={localConfig.heroButtonColor}
              onChange={(color) => handleColorChange("heroButtonColor", color)}
              label={t("landingPageConfig.heroButtonColor")}
            />
          </FormControl>
          <FormControl>
  <FormLabel>{t("landingPageConfig.heroBgGradient")}</FormLabel>
  <GradientGenerator
    value={landingPageConfig.heroBgGradient}
    onChange={(newGradient) => handleColorChange("heroBgGradient", newGradient)}
  />
</FormControl>
          <FormControl>
            <FormLabel>{t("landingPageConfig.heroTextColor")}</FormLabel>
            <ColorPicker
              color={localConfig.heroTextColor}
              onChange={(color) => handleColorChange("heroTextColor", color)}
              label={t("landingPageConfig.heroTextColor")}
            />
          </FormControl>
          <FormControl gridColumn="span 2">
            <FormLabel>{t("landingPageConfig.heroImage")}</FormLabel>
            <ImageUpload
              onImageUpload={handleImageUpload}
              initialImage={localConfig.heroImage}
            />
          </FormControl>
        </SimpleGrid>
      </Box>
      <Box>
        <Heading size="sm" mb={4}>
          {t("landingPageConfig.featuresSection")}
        </Heading>
        <FormControl>
          <FormLabel>{t("landingPageConfig.featuresTitle")}</FormLabel>
          <Input
            name="featuresTitle"
            value={localConfig.featuresTitle}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>{t("landingPageConfig.featuresSubtitle")}</FormLabel>
          <Textarea
            name="featuresSubtitle"
            value={localConfig.featuresSubtitle}
            onChange={handleChange}
          />
        </FormControl>

        {renderFeatures}

        <CustomButton
          leftIcon={<FaPlus />}
          colorScheme="blue"
          mt={4}
          onClick={addFeature}
        >
          {t("landingPageConfig.addFeature")}
        </CustomButton>
      </Box>
    </VStack>
  );
};

LandingPageTab.propTypes = {
  landingPageConfig: PropTypes.object.isRequired,
  onLandingPageConfigChange: PropTypes.func.isRequired,
};

export default React.memo(LandingPageTab);
