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
import countryData from "country-telephone-data";

export const GeneralTab = ({ localConfig, setLocalConfig }) => {
  const { t, i18n } = useTranslation();
  const { config } = useStoreConfigStore();

  const [previewLanguage, setPreviewLanguage] = useState(config.language);
  const [phoneError, setPhoneError] = useState("");
  const bgColor = useColorModeValue("white", "gray.700");
  const sectionBgColor = useColorModeValue("gray.50", "gray.600");

  const countries = useMemo(() => {
    return countryData.allCountries.map((country) => ({
      name: country.name,
      iso2: country.iso2,
      dialCode: country.dialCode,
    }));
  }, []);

  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (localConfig.whatsappNumber) {
      try {
        const phoneNumber = parsePhoneNumber(localConfig.whatsappNumber);
        return phoneNumber ? phoneNumber.country : "CO";
      } catch (error) {
        console.error("Error parsing phone number:", error);
        return "CO";
      }
    }
    return "CO";
  });

  const [phoneInput, setPhoneInput] = useState(() => {
    if (localConfig.whatsappNumber) {
      try {
        const phoneNumber = parsePhoneNumber(localConfig.whatsappNumber);
        return phoneNumber ? phoneNumber.nationalNumber : "";
      } catch (error) {
        console.error("Error getting national number:", error);
        return "";
      }
    }
    return "";
  });

  useEffect(() => {
    if (localConfig.whatsappNumber) {
      try {
        const phoneNumber = parsePhoneNumber(localConfig.whatsappNumber);
        if (phoneNumber) {
          setSelectedCountry(phoneNumber.country);
          setPhoneInput(phoneNumber.nationalNumber);
        }
      } catch (error) {
        console.error("Error updating phone number:", error);
        setSelectedCountry("CO");
        setPhoneInput("");
      }
    } else {
      setSelectedCountry("CO");
      setPhoneInput("");
    }
  }, [localConfig.whatsappNumber]);

  const debouncedSetLocalConfig = useMemo(
    () =>
      debounce(
        (updates) => setLocalConfig((prev) => ({ ...prev, ...updates })),
        300
      ),
    [setLocalConfig]
  );

  const handleConfigChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      debouncedSetLocalConfig({ [name]: value });
    },
    [debouncedSetLocalConfig]
  );

  const handleLanguageChange = useCallback(
    (e) => {
      const newLanguage = e.target.value;
      setPreviewLanguage(newLanguage);
      setLocalConfig((prev) => ({ ...prev, language: newLanguage }));
    },
    [setLocalConfig]
  );

  const handleCountryChange = useCallback((e) => {
    setSelectedCountry(e.target.value);
  }, []);

  const handlePhoneChange = useCallback(
    (e) => {
      const input = e.target.value;
      setPhoneInput(input);
      const fullNumber = `+${
        countries.find((c) => c.iso2 === selectedCountry).dialCode
      }${input}`;

      try {
        if (isValidPhoneNumber(fullNumber)) {
          const parsedNumber = parsePhoneNumber(fullNumber);
          setPhoneError("");
          setLocalConfig((prev) => ({
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
    [selectedCountry, countries, setLocalConfig, t]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setLocalConfig((prev) => ({ ...prev, logo: event.target.result }));
      };
      reader.readAsDataURL(file);
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

  const [whatsappNumber, setWhatsappNumber] = useState(
    localConfig.whatsappNumber || ""
  );

  const handleWhatsappNumberChange = useCallback(
    (e) => {
      const input = e.target.value;
      setWhatsappNumber(input);

      try {
        if (isValidPhoneNumber(input)) {
          const parsedNumber = parsePhoneNumber(input);
          setPhoneError("");
          setLocalConfig((prev) => ({
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
    [setLocalConfig, t]
  );

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
                  value={whatsappNumber}
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
    description: PropTypes.string.isRequired,
    logo: PropTypes.string,
    language: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    darkMode: PropTypes.bool.isRequired,
  }).isRequired,
  setLocalConfig: PropTypes.func.isRequired,
};

export default GeneralTab;
