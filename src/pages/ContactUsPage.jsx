import React, { useState } from 'react';
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
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log(formData);
    toast({
      title: 'Formulario enviado',
      description: 'Nos pondremos en contacto contigo pronto.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box  py={12}>
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center">
            Contáctanos
          </Heading>
          
          <HStack spacing={8} align="start">
            <VStack spacing={4} align="stretch" flex={1}>
              <Heading as="h2" size="lg">Envíanos un mensaje</Heading>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Nombre</FormLabel>
                    <Input name="name" value={formData.name} onChange={handleInputChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Mensaje</FormLabel>
                    <Textarea name="message" value={formData.message} onChange={handleInputChange} />
                  </FormControl>
                  <Button type="submit" colorScheme="blue">Enviar</Button>
                </VStack>
              </form>
            </VStack>
            
            <VStack spacing={6} align="start" flex={1}>
              <Heading as="h2" size="lg">Información de Contacto</Heading>
              <HStack>
                <FaEnvelope />
                <Text color={textColor}>contacto@tuempresa.com</Text>
              </HStack>
              <HStack>
                <FaPhone />
                <Text color={textColor}>+1 234 567 8900</Text>
              </HStack>
              <HStack>
                <FaMapMarkerAlt />
                <Text color={textColor}>123 Calle Principal, Ciudad, País</Text>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default ContactUsPage;