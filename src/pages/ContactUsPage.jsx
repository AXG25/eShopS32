import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import CustomButton from "../Components/common/CustomButton";
import useStoreConfigStore from "../store/useStoreConfigStore";
import { sendWhatsAppMessage } from "../utils/sendWhatsAppMessage";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const textColor = useColorModeValue("gray.600", "gray.200");

  const { t } = useTranslation();
  const { config } = useStoreConfigStore();
  const { footer, whatsappNumber } = config;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const message = `
*Nuevo mensaje de contacto:*
Nombre: ${formData.name}
Email: ${formData.email}
Mensaje: ${formData.message}
      `;

      sendWhatsAppMessage(config.whatsappNumber, message);

      toast({
        title: t("contactUs.successTitle"),
        description: t("contactUs.successMessage"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      toast({
        title: t("contactUs.errorTitle"),
        description: t("contactUs.errorMessage"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box py={12}>
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center">
            {t("contactUs.title")}
          </Heading>

          <HStack
            spacing={8}
            align="start"
            flexDirection={{ base: "column", md: "row" }}
          >
            <VStack spacing={4} align="stretch" flex={1} width="100%">
              <Heading as="h2" size="lg">
                {t("contactUs.sendMessage")}
              </Heading>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>{t("contactUs.name")}</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t("contactUs.email")}</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t("contactUs.message")}</FormLabel>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <CustomButton
                    type="submit"
                    colorScheme="blue"
                    w="100%"
                    isLoading={isSubmitting}
                  >
                    {t("contactUs.send")}
                  </CustomButton>
                </VStack>
              </form>
            </VStack>

            <VStack spacing={6} align="start" flex={1} width="100%">
              <Heading as="h2" size="lg">
                {t("contactUs.contactInfo")}
              </Heading>
              <HStack>
                <FaEnvelope />
                <Text color={textColor}>{footer.contact.email}</Text>
              </HStack>
              <HStack>
                <FaPhone />
                <Text color={textColor}>{footer.contact.phone}</Text>
              </HStack>
              <HStack>
                <FaMapMarkerAlt />
                <Text color={textColor}>{footer.contact.address}</Text>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default ContactUsPage;
