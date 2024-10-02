import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Button,
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

const MotionBox = motion(Box);

const CartView = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuth();
  const cardBgColor = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const navigate = useNavigate();
  const toast = useToast();

  const [orderForm, setOrderForm] = useState({
    cedula: "",
    telefono: "",
    requiresDelivery: false,
    nombre: "",
    direccion: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Necesitas iniciar sesión para proceder con el pago.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    // Validar el formulario
    if (
      !orderForm.cedula ||
      !orderForm.telefono ||
      (orderForm.requiresDelivery &&
        (!orderForm.nombre || !orderForm.direccion))
    ) {
      toast({
        title: "Formulario incompleto",
        description: "Por favor, completa todos los campos requeridos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Preparar los datos del pedido
    const orderData = {
      ...orderForm,
      items,
      total: getTotalPrice(),
    };

    try {
      // Enviar datos al endpoint
      await axios.post("/api/orders", orderData);

      // Enviar mensaje a WhatsApp
      const whatsappMessage = `Nuevo pedido:\n
Cédula: ${orderForm.cedula}
Teléfono: ${orderForm.telefono}
${
  orderForm.requiresDelivery
    ? `Nombre: ${orderForm.nombre}\nDirección: ${orderForm.direccion}`
    : ""
}
Productos:\n${items
        .map((item) => `- ${item.title} (x${item.quantity})`)
        .join("\n")}
Total: €${getTotalPrice().toFixed(2)}`;

      const whatsappUrl = `https://wa.me/NUMERO_DEL_ADMINISTRADOR?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      window.open(whatsappUrl, "_blank");

      // Limpiar el carrito y mostrar mensaje de éxito
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
            <Heading size="xl">Tu Carrito</Heading>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              as={Link}
              to="/home"
            >
              Seguir Comprando
            </Button>
          </Flex>

          {items.length === 0 ? (
            <Text fontSize="lg" textAlign="center" color={textColor}>
              Tu carrito está vacío. ¡Agrega algunos productos!
            </Text>
          ) : (
            <>
              {items.map((item) => (
                <MotionBox
                  key={item.id}
                  bg={cardBgColor}
                  p={4}
                  borderRadius="lg"
                  boxShadow="md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Flex justify="space-between" align="center">
                    <HStack spacing={4}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {item.title}
                        </Text>
                        <Badge colorScheme="blue">{item.category}</Badge>
                        <Text color={textColor}>€{item.price.toFixed(2)}</Text>
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
                      />
                      <Text fontWeight="bold" minW="40px" textAlign="center">
                        {item.quantity}
                      </Text>
                      <IconButton
                        icon={<FaPlus />}
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        size="sm"
                        variant="outline"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        onClick={() => removeFromCart(item.id)}
                        colorScheme="red"
                        size="sm"
                      />
                    </HStack>
                  </Flex>
                </MotionBox>
              ))}

              <Divider />

              <VStack spacing={4} align="stretch">
                <Heading size="md">Información del Pedido</Heading>
                <FormControl isRequired>
                  <FormLabel>Cédula</FormLabel>
                  <Input
                    name="cedula"
                    value={orderForm.cedula}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    name="telefono"
                    value={orderForm.telefono}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <Checkbox
                  name="requiresDelivery"
                  isChecked={orderForm.requiresDelivery}
                  onChange={handleInputChange}
                >
                  ¿Requiere envío?
                </Checkbox>
                {orderForm.requiresDelivery && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        name="nombre"
                        value={orderForm.nombre}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Dirección</FormLabel>
                      <Textarea
                        name="direccion"
                        value={orderForm.direccion}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </>
                )}
              </VStack>

              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold">
                    Total: €{getTotalPrice().toFixed(2)}
                  </Text>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={handleClearCart}
                    size="sm"
                  >
                    Vaciar Carrito
                  </Button>
                </VStack>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleCheckout}
                  leftIcon={<FaWhatsapp />}
                >
                  {isAuthenticated
                    ? "Realizar Pedido"
                    : "Iniciar Sesión para Comprar"}
                </Button>
              </Flex>
            </>
          )}
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default CartView;
