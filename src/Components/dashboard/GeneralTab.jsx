import { useState, useEffect, useCallback, useMemo } from "react";
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
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { FaStore, FaLanguage, FaUpload, FaWhatsapp } from "react-icons/fa";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

export const GeneralTab = ({ localConfig, setLocalConfig }) => {
  const { t, i18n } = useTranslation();
  const { config } = useStoreConfigStore();

  const [localInputs, setLocalInputs] = useState({
    title: localConfig.title,
    description: localConfig.description,
    whatsappNumber: localConfig.whatsappNumber || "",
  });
  const [previewLanguage, setPreviewLanguage] = useState(config.language);
  const [phoneError, setPhoneError] = useState("");
  const bgColor = useColorModeValue("white", "gray.700");
  const sectionBgColor = useColorModeValue("gray.50", "gray.600");

  const debouncedSetLocalConfig = useMemo(
    () => debounce(setLocalConfig, 300),
    [setLocalConfig]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    debouncedSetLocalConfig({ ...localConfig, ...localInputs });
  }, [localInputs, localConfig, debouncedSetLocalConfig]);

  const handleLanguageChange = useCallback(
    (e) => {
      const newLanguage = e.target.value;
      setPreviewLanguage(newLanguage);
      setLocalConfig((prev) => ({ ...prev, language: newLanguage }));
    },
    [setLocalConfig]
  );

  const handleWhatsappNumberChange = useCallback(
    (e) => {
      const input = e.target.value;
      setLocalInputs((prev) => ({ ...prev, whatsappNumber: input }));

      try {
        if (isValidPhoneNumber(input)) {
          const parsedNumber = parsePhoneNumber(input);
          setPhoneError("");
          debouncedSetLocalConfig((prev) => ({
            ...prev,
            whatsappNumber: parsedNumber.number,
          }));
        } else {
          setPhoneError(t("store.invalidPhoneNumber"));
        }
      } catch (error) {
        setPhoneError(t("store.invalidPhoneNumber"));
      }
    },
    [debouncedSetLocalConfig, t]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setLocalConfig((prev) => ({ ...prev, logo: base64String }));
        };
        reader.readAsDataURL(file);
      }
    },
    [setLocalConfig]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxFiles: 1,
  });

  useEffect(() => {
    i18n.changeLanguage(previewLanguage);
    return () => {
      i18n.changeLanguage(config.language);
    };
  }, [previewLanguage, config.language, i18n]);

  return (
    <VStack
      spacing={6}
      align="stretch"
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
    >
      {/* Store Information Section */}
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
              value={localInputs.title}
              onChange={handleInputChange}
              placeholder={t("store.enterTitle")}
            />
          </Box>
          <Box>
            <Text fontWeight="semibold" mb={2}>
              {t("store.description")}
            </Text>
            <Input
              name="description"
              value={localInputs.description}
              onChange={handleInputChange}
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
      {/* Language Section */}
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
          <Divider />

          {/* WhatsApp Configuration Section */}
          <Box>
            <HStack mb={4}>
              <FaWhatsapp size="24px" />
              <Heading as="h2" size="lg">
                {t("store.whatsappConfig")}
              </Heading>
            </HStack>
            <VStack
              spacing={4}
              align="stretch"
              bg={sectionBgColor}
              p={4}
              borderRadius="md"
            >
              <FormControl isInvalid={!!phoneError}>
                <FormLabel>{t("store.whatsappNumber")}</FormLabel>
                <Input
                  value={localInputs.whatsappNumber}
                  onChange={handleWhatsappNumberChange}
                  placeholder={t("store.enterWhatsappNumber")}
                />
                <FormErrorMessage>{phoneError}</FormErrorMessage>
              </FormControl>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
};

GeneralTab.propTypes = {
  localConfig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    whatsappNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string.isRequired,
    logo: PropTypes.string,
    language: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    darkMode: PropTypes.bool.isRequired,
  }).isRequired,
  setLocalConfig: PropTypes.func.isRequired,
};

export default GeneralTab;
