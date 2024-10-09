// src/components/checkout/Checkout.jsx
import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Text,
  Divider,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import CustomButton from "../common/CustomButton";

const Checkout = () => {
  const { cartItems, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const toast = useToast();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica real de procesamiento de pago
    console.log("Procesando pago:", formData);
    clearCart();
    toast({
      title: "Pago realizado con éxito",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/orders");
  };

  return (
    <Box maxWidth="600px" margin="auto" mt={8} p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>Checkout</Heading>
        <Box>
          <Heading size="md" mb={2}>
            Resumen del pedido
          </Heading>
          {cartItems.map((item) => (
            <Text key={item.id}>
              {item.title} - €{item.price.toFixed(2)} x {item.quantity}
            </Text>
          ))}
          <Divider my={2} />
          <Text fontWeight="bold">Total: €{total.toFixed(2)}</Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre completo</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Dirección de envío</FormLabel>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Número de tarjeta</FormLabel>
              <Input
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Fecha de expiración</FormLabel>
              <Input
                name="expirationDate"
                placeholder="MM/YY"
                value={formData.expirationDate}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>CVV</FormLabel>
              <Input name="cvv" value={formData.cvv} onChange={handleChange} />
            </FormControl>
            <CustomButton type="submit" colorScheme="blue" width="full">
              Realizar Pago
            </CustomButton>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Checkout;
