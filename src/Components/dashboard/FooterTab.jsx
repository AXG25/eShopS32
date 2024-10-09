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
import PropTypes from 'prop-types';
import CustomButton from "../common/CustomButton";

export const FooterTab = ({ footerConfig, onFooterConfigChange }) => {
  const handleChange = (e, section, index, key) => {
    const { value } = e.target;
    const newFooterConfig = { ...footerConfig };
    if (section === "contact") {
      newFooterConfig.contact[key] = value;
    } else {
      newFooterConfig[section][index][key] = value;
    }
    onFooterConfigChange(newFooterConfig);
  };

  const addItem = (section) => {
    const newFooterConfig = { ...footerConfig };
    newFooterConfig[section].push({ name: "", url: "" });
    onFooterConfigChange(newFooterConfig);
  };

  const removeItem = (section, index) => {
    const newFooterConfig = { ...footerConfig };
    newFooterConfig[section].splice(index, 1);
    onFooterConfigChange(newFooterConfig);
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
      {renderSection("storeInfo", "Información de la Tienda")}
      {renderSection("customerService", "Atención al Cliente")}
      {renderSection("myAccount", "Mi Cuenta")}
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