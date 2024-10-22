import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import { useEffect } from "react";

export const FooterTab = ({ footerConfig, onFooterConfigChange }) => {
  const { config } = useStoreConfigStore();

  const handleChange = (e, section, index, key) => {
    const { value } = e.target;
    if (section === "contact") {
      onFooterConfigChange({
        ...footerConfig,
        contact: {
          ...footerConfig.contact,
          [key]: value,
        },
      });
    } else {
      const updatedSection = [...footerConfig[section]];
      updatedSection[index] = {
        ...updatedSection[index],
        [key]: value,
      };
      onFooterConfigChange({
        ...footerConfig,
        [section]: updatedSection,
      });
    }
  };

  useEffect(() => {
   console.log('config', config)
  }, [config])
  

  const renderSocialLinks = () => (
    <>
      <Heading size="md" mt={4}>
        Redes Sociales
      </Heading>
      <HStack>
        <Input
          placeholder="Facebook"
          value={footerConfig.socialLinks[0]?.url || config.facebook}
          onChange={(e) => handleChange(e, "socialLinks", 0, "url")}
        />
      </HStack>
      <HStack>
        <Input
          placeholder="Twitter"
          value={footerConfig.socialLinks[1]?.url || ""}
          onChange={(e) => handleChange(e, "socialLinks", 1, "url")}
        />
      </HStack>
      <HStack>
        <Input
          placeholder="Instagram"
          value={footerConfig.socialLinks[2]?.url || config.instagram}
          onChange={(e) => handleChange(e, "socialLinks", 2, "url")}
        />
      </HStack>
    </>
  );

  return (
    <VStack spacing={6} align="stretch">
      {renderSocialLinks()}

      <Heading size="md" mt={4}>
        Información de Contacto
      </Heading>
      <FormControl>
        <FormLabel>Dirección</FormLabel>
        <Textarea
          value={footerConfig.contact.address}
          onChange={(e) => handleChange(e, "contact", null, "address")}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Teléfono</FormLabel>
        <Input
          value={footerConfig.contact.phone || config.phone}
          onChange={(e) => handleChange(e, "contact", null, "phone")}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          value={footerConfig.contact.email || config.email}
          onChange={(e) => handleChange(e, "contact", null, "email")}
        />
      </FormControl>
    </VStack>
  );
};

FooterTab.propTypes = {
  footerConfig: PropTypes.object.isRequired,
  onFooterConfigChange: PropTypes.func.isRequired,
};

export default FooterTab;
