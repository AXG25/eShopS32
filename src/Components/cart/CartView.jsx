/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
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
  AlertDialogBody,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@chakra-ui/react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaWhatsapp,
} from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import axios from "axios";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import countryData from "country-telephone-data";
import env from "../../config/env";
import { isTransformableToNumber, parseFloat } from "../../utils/numberFormatting";
import CustomButton from "../common/CustomButton";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import { NumericFormat } from "react-number-format";

const MotionBox = motion(Box);
const CartView = () => {
  const { config } = useStoreConfigStore();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();

  const [orderForm, setOrderForm] = useState({
    IDNumber: "",
    phonePrefix: "+57",
    phoneNumber: "",
    email: "",
    customInvoiceRequired: false,
    name: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [prefixes, setPrefixes] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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
      setItemToDelete({ id: productId, action: "remove" });
      setIsAlertOpen(true);
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

      const whatsappMessage = encodeURIComponent(`
*Nuevo pedido:*
${orderForm.name ? `Nombre: ${orderForm.name}` : ""}
${orderForm.IDNumber ? `Cédula: ${orderForm.IDNumber}` : ""}        
Teléfono: ${orderForm.phoneNumber}      
Email: ${orderForm.email}            
Productos:
${items
  .map(
    (item, index) =>
      `*${index + 1}.* ${item.title} - ${item.price} (x${item.quantity})`
  )
  .join("\n")}
  *Total: ${getTotalPrice()}*`);

      const whatsappUrl = `https://wa.me/+573025479797?text=${whatsappMessage}`;

      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 3000);

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
    setItemToDelete({ action: "clear" });
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete.action === "remove") {
      removeFromCart(itemToDelete.id);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del carrito.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else if (itemToDelete.action === "clear") {
      clearCart();
      toast({
        title: "Carrito vaciado",
        description: "Todos los productos han sido eliminados del carrito.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
    setIsAlertOpen(false);
  };

  const formatPrice = (price) => {
    return isTransformableToNumber(price)
      ? parseFloat(price, { defaultValue: 0 })
      : "N/A";
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
                  {items.map((item, index) => (
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
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color={config.primaryColor}
                          >
                            {index + 1}.
                          </Text>
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
                            <NumericFormat
                              value={formatPrice(item.price)}
                              displayType={"text"}
                              prefix={"$"}
                              thousandSeparator=","
                              decimalSeparator="."
                              fixedDecimalScale={true}
                              renderText={(value) => (
                                <Text color={textColor} fontWeight="bold">
                                  {value}
                                </Text>
                              )}
                            />
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
                            borderColor={config.primaryColor}
                            color={config.primaryColor}
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
                            borderColor={config.primaryColor}
                            color={config.primaryColor}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            onClick={() => {
                              setItemToDelete({
                                id: item.id,
                                action: "remove",
                              });
                              setIsAlertOpen(true);
                            }}
                            colorScheme="red"
                            size="sm"
                            variant="ghost"
                            color={config.primaryColor}
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
                            {prefix.label}
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
                    </>
                  )}
                </VStack>
              </SimpleGrid>

              <Divider my={6} />

              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    Total del Pedido:
                  </Text>
                  <NumericFormat
                    value={getTotalPrice()}
                    displayType={"text"}
                    thousandSeparator=","
                    decimalSeparator="."
                    prefix={"$"}
                    fixedDecimalScale={true}
                    renderText={(value) => (
                      <Text
                        fontSize={{ base: "4xl", md: "6xl" }}
                        fontWeight="extrabold"
                        letterSpacing="wide"
                        color={config.primaryColor}
                        lineHeight="1"
                      >
                        {value}
                      </Text>
                    )}
                  />
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
                  width="300px"
                  height="80px"
                  fontSize="30px"
                  onClick={handleCheckout}
                  leftIcon={<IoLogoWhatsapp />}
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

        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsAlertOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {itemToDelete?.action === "clear"
                  ? "Vaciar Carrito"
                  : "Eliminar Producto"}
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Estás seguro de que deseas{" "}
                {itemToDelete?.action === "clear"
                  ? "vaciar el carrito"
                  : "eliminar este producto"}
                ?
              </AlertDialogBody>

              <AlertDialogFooter>
                <CustomButton
                  ref={cancelRef}
                  onClick={() => setIsAlertOpen(false)}
                  colorScheme="gray"
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  colorScheme="red"
                  onClick={handleConfirmDelete}
                  ml={3}
                >
                  {itemToDelete?.action === "clear" ? "Vaciar" : "Eliminar"}
                </CustomButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </MotionBox>
    </Container>
  );
};

export default CartView;
