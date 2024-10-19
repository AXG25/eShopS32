import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";
import CustomButton from "../common/CustomButton";

export const FooterTab = ({ footerConfig, onFooterConfigChange }) => {
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

  const addItem = (section) => {
    const updatedSection = [...footerConfig[section], { name: "", url: "" }];
    onFooterConfigChange({
      ...footerConfig,
      [section]: updatedSection,
    });
  };

  const removeItem = (section, index) => {
    const updatedSection = footerConfig[section].filter((_, i) => i !== index);
    onFooterConfigChange({
      ...footerConfig,
      [section]: updatedSection,
    });
  };

  const renderSection = (sectionName, sectionTitle) => (
    <>
      <Heading size="md" mt={4}>
        {sectionTitle}
      </Heading>
      {footerConfig[sectionName].map((item, index) => (
        <HStack key={index}>
          <Input
            placeholder="Nombre"
            value={item.name}
            onChange={(e) => handleChange(e, sectionName, index, "name")}
          />
          <Input
            placeholder="URL"
            value={item.url}
            onChange={(e) => handleChange(e, sectionName, index, "url")}
          />
          <IconButton
            icon={<FaTrash />}
            onClick={() => removeItem(sectionName, index)}
          />
        </HStack>
      ))}
      <CustomButton leftIcon={<FaPlus />} onClick={() => addItem(sectionName)}>
        Añadir Item
      </CustomButton>
    </>
  );

  return (
    <VStack spacing={6} align="stretch">
      {renderSection("socialLinks", "Redes Sociales")}

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
          value={footerConfig.contact.phone}
          onChange={(e) => handleChange(e, "contact", null, "phone")}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          value={footerConfig.contact.email}
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
