/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  IconButton,
  Heading,
  Divider,
  useColorModeValue,
  Container,
  Flex,
  Badge,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Textarea,
  FormErrorMessage,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaWhatsapp,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import axios from "axios";
import {
  parsePhoneNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";
import countryData from "country-telephone-data";
import env from "../../config/env";
import { isTransformableToNumber } from "../../utils/numberFormatting";
import CustomButton from "../common/CustomButton";

const MotionBox = motion(Box);

const CartView = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const toast = useToast();

  const [orderForm, setOrderForm] = useState({
    IDNumber: "",
    phonePrefix: "",
    phoneNumber: "",
    email: "",
    customInvoiceRequired: false,
    name: "",
    address: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [prefixes, setPrefixes] = useState([]);

  // const cardBgColor = useColorModeValue("white", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const formBgColor = useColorModeValue("gray.50", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const sortedPrefixes = countryData.allCountries
      .map((country) => ({
        value: `+${country.dialCode}`,
        label: `${country.name} (+${country.dialCode})`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    setPrefixes(sortedPrefixes);
  }, []);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phoneNumber, countryCode) => {
    if (!phoneNumber || !countryCode) return { isValid: false };

    try {
      const fullNumber = `+${countryCode}${phoneNumber}`;
      if (isValidPhoneNumber(fullNumber)) {
        const parsedNumber = parsePhoneNumber(fullNumber);
        return {
          isValid: true,
          country: parsedNumber.country,
          formattedNumber: parsedNumber.formatInternational(),
        };
      }
    } catch (error) {
      console.error("Error al validar el número de teléfono:", error);
    }
    return { isValid: false };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Email inválido",
      }));
    }
  };

  const handlePrefixChange = (e) => {
    const prefix = e.target.value;
    setOrderForm((prev) => ({
      ...prev,
      phonePrefix: prefix,
    }));

    // Re-validar el número con el nuevo prefijo
    if (orderForm.phoneNumber) {
      handlePhoneChange({ target: { value: orderForm.phoneNumber } });
    }
  };

  const handlePhoneChange = (e) => {
    const phoneNumber = e.target.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
    const countryCode = orderForm.phonePrefix.replace("+", "");

    setOrderForm((prev) => ({
      ...prev,
      phoneNumber: phoneNumber,
    }));

    if (phoneNumber && countryCode) {
      const phoneValidation = validatePhoneNumber(phoneNumber, countryCode);
      console.log("Validación:", phoneValidation); // Para depuración

      setFormErrors((prev) => ({
        ...prev,
        phoneNumber: phoneValidation.isValid
          ? ""
          : "Número de teléfono inválido",
      }));

      if (phoneValidation.isValid) {
        setOrderForm((prev) => ({
          ...prev,
          country: phoneValidation.country,
        }));
      }
    } else {
      setFormErrors((prev) => ({
        ...prev,
        phoneNumber: "",
      }));
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId);
    }
  };

  const handleCheckout = async () => {
    const errors = {};
    if (!validateEmail(orderForm.email)) {
      errors.email = "Email inválido";
    }

    if (!orderForm.phonePrefix || !orderForm.phoneNumber) {
      errors.phoneNumber = "Número de teléfono completo requerido";
    } else if (
      !validatePhoneNumber(
        orderForm.phoneNumber,
        orderForm.phonePrefix.replace("+", "")
      ).isValid
    ) {
      errors.phoneNumber = "Número de teléfono inválido";
    }
    if (orderForm.customInvoiceRequired) {
      if (!orderForm.IDNumber) {
        errors.IDNumber = "Cédula requerida";
      }
      if (!orderForm.name) {
        errors.name = "Nombre requerido";
      }
      if (!orderForm.address) {
        errors.address = "Dirección requerida";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Formulario incompleto",
        description: "Por favor, corrige los errores en el formulario.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const orderData = {
      ...orderForm,
      items,
      total: getTotalPrice(),
    };

    try {
      await axios.post(env.CART.CREATE_ORDER, orderData);

     /*  const whatsappMessage = `Nuevo pedido:\n
Cédula: ${orderForm.IDNumber}
Teléfono: ${orderForm.phoneNumber}
Email: ${orderForm.email}
${
  orderForm.customInvoiceRequired
    ? `Nombre: ${orderForm.name}\nDirección: ${orderForm.address}`
    : ""
}
Productos:\n${items
        .map((item) => `- ${item.title} (x${item.quantity})`)
        .join("\n")}
Total: €${getTotalPrice().toFixed(2)}`; */
/* 
      /*      const whatsappUrl = `https://wa.me/NUMERO_DEL_ADMINISTRADOR?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      window.open(whatsappUrl, "_blank"); */ 

      clearCart();
      toast({
        title: "Pedido realizado con éxito",
        description: "Tu pedido ha sido enviado. Te contactaremos pronto.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/home");
    } catch (error) {
      toast({
        title: "Error al procesar el pedido",
        description:
          "Hubo un problema al enviar tu pedido. Por favor, intenta de nuevo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos han sido eliminados del carrito.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="xl" fontWeight="extrabold" letterSpacing="tight">
              Tu Carrito
            </Heading>
            <CustomButton
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              as={Link}
              to="/home"
              _hover={{ bg: "blue.50" }}
            >
              Seguir Comprando
            </CustomButton>
          </Flex>

          {items.length === 0 ? (
            <Text fontSize="lg" textAlign="center" color={textColor}>
              Tu carrito está vacío. ¡Agrega algunos productos!
            </Text>
          ) : (
            <>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack spacing={4} align="stretch">
                  {items.map((item) => (
                    <MotionBox
                      key={item.id}
                      bg={bgColor}
                      p={4}
                      borderRadius="lg"
                      boxShadow="sm"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flex justify="space-between" align="center">
                        <HStack spacing={4}>
                          <Image
                            src={item.image}
                            alt={item.title}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium" fontSize="sm">
                              {item.title}
                            </Text>
                            <Badge colorScheme="blue" variant="subtle">
                              {item.category}
                            </Badge>
                            <Text color={textColor} fontWeight="bold">
                              €
                              {isTransformableToNumber(item.price)
                                ? parseFloat(item.price, {
                                    defaultValu: 0,
                                  }).toFixed(2)
                                : "N/A"}
                            </Text>
                          </VStack>
                        </HStack>
                        <HStack>
                          <IconButton
                            icon={<FaMinus />}
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            size="sm"
                            variant="outline"
                            borderRadius="full"
                          />
                          <Text
                            fontWeight="bold"
                            minW="30px"
                            textAlign="center"
                          >
                            {item.quantity}
                          </Text>
                          <IconButton
                            icon={<FaPlus />}
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            size="sm"
                            variant="outline"
                            borderRadius="full"
                          />
                          <IconButton
                            icon={<FaTrash />}
                            onClick={() => removeFromCart(item.id)}
                            colorScheme="red"
                            size="sm"
                            variant="ghost"
                          />
                        </HStack>
                      </Flex>
                    </MotionBox>
                  ))}
                </VStack>

                <VStack
                  spacing={6}
                  align="stretch"
                  bg={formBgColor}
                  p={6}
                  borderRadius="lg"
                >
                  <Heading size="md" fontWeight="semibold">
                    Información del Pedido
                  </Heading>
                  <FormControl isRequired isInvalid={!!formErrors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      value={orderForm.email}
                      onChange={handleInputChange}
                      placeholder="ejemplo@correo.com"
                      bg={inputBgColor}
                    />
                    <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={!!formErrors.phoneNumber}>
                    <FormLabel>Teléfono</FormLabel>
                    <HStack>
                      <Select
                        value={orderForm.phonePrefix}
                        onChange={handlePrefixChange}
                        placeholder="Prefijo"
                        width="30%"
                        isRequired
                      >
                        {prefixes.map((prefix) => (
                          <option key={prefix.value} value={prefix.value}>
                            {prefix.value}
                          </option>
                        ))}
                      </Select>
                      <Input
                        name="phoneNumber"
                        value={orderForm.phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Número sin prefijo"
                        width="70%"
                        bg={inputBgColor}
                        isRequired
                      />
                    </HStack>
                    <FormErrorMessage>
                      {formErrors.phoneNumber}
                    </FormErrorMessage>
                    {orderForm.country && (
                      <Text fontSize="sm" color="green.500">
                        País detectado: {orderForm.country}
                      </Text>
                    )}
                  </FormControl>

                  <Checkbox
                    name="customInvoiceRequired"
                    isChecked={orderForm.customInvoiceRequired}
                    onChange={handleInputChange}
                    colorScheme="blue"
                  >
                    ¿Factura Personalizada Requerida?
                  </Checkbox>
                  {orderForm.customInvoiceRequired && (
                    <>
                      <FormControl isRequired isInvalid={!!formErrors.IDNumber}>
                        <FormLabel>Cédula o DNI</FormLabel>
                        <Input
                          name="IDNumber"
                          value={orderForm.IDNumber}
                          onChange={handleInputChange}
                          placeholder="12345678A"
                          bg={inputBgColor}
                        />
                        <FormErrorMessage>
                          {formErrors.IDNumber}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isRequired isInvalid={!!formErrors.name}>
                        <FormLabel>Nombre Completo</FormLabel>
                        <Input
                          name="name"
                          value={orderForm.name}
                          onChange={handleInputChange}
                          placeholder="Juan Pérez García"
                          bg={inputBgColor}
                        />
                        <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!formErrors.address}>
                        <FormLabel>Dirección de Facturación</FormLabel>
                        <Textarea
                          name="address"
                          value={orderForm.address}
                          onChange={handleInputChange}
                          placeholder="Calle Example 123, Piso 4º, 28001 Madrid, España"
                          bg={inputBgColor}
                        />
                        <FormErrorMessage>
                          {formErrors.address}
                        </FormErrorMessage>
                      </FormControl>
                    </>
                  )}
                </VStack>
              </SimpleGrid>

              <Divider my={6} />

              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold">
                    Total: €{getTotalPrice().toFixed(2)}
                  </Text>
                  <CustomButton
                    colorScheme="red"
                    variant="outline"
                    onClick={handleClearCart}
                    size="sm"
                    borderRadius="full"
                  >
                    Vaciar Carrito
                  </CustomButton>
                </VStack>
                <CustomButton
                  colorScheme="blue"
                  size="lg"
                  onClick={handleCheckout}
                  leftIcon={<FaWhatsapp />}
                  borderRadius="full"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Realizar Pedido
                </CustomButton>
              </Flex>
            </>
          )}
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default CartView;
