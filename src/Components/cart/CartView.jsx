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
} from "@chakra-ui/react";
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const CartView = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuth();
  //const bgColor = useColorModeValue('gray.50', 'gray.700');
  const cardBgColor = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const navigate = useNavigate();
  const toast = useToast();

  // Manejador para cambiar la cantidad de un producto
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId);
    }
  };

  // Manejador para proceder al pago
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Necesitas iniciar sesión para proceder con el pago.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login", { state: { from: "/cart" } });
    } else {
      // Aquí iría la lógica para proceder al pago
      toast({
        title: "Procesando pago",
        description: "Redirigiendo al proceso de pago...",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      navigate("/checkout");
    }
  };

  // Manejador para vaciar el carrito
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
            <Button leftIcon={<FaArrowLeft />} variant="ghost" as={Link} to="/">
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
                <Button colorScheme="blue" size="lg" onClick={handleCheckout}>
                  {isAuthenticated
                    ? "Proceder al Pago"
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
