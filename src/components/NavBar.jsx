import { Flex, Link as ChakraLink, Text, Icon, Box } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // Importamos el ícono del carrito

const NavBar = () => {
  const location = useLocation();


  const isActive = (path) => location.pathname === path;

  // Ejemplo: cantidad de productos en el carrito
  const cartItemCount = 3;

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Categorías", path: "/categorias" },
    { name: "Nosotros", path: "/nosotros" },
    { name: "Productos", path: "/productos" },
    { name: "Contacto", path: "/contacto" },
  ];

  return (
    <Flex
      as="nav"
      p={4}
      justify="space-around"
      align="center"
    >
      {navItems.map((item) => (
        <ChakraLink
          as={Link}
          key={item.name}
          to={item.path}
          position="relative"
          _hover={{
            textDecoration: "none",
            transform: "scale(1.05)",
            transition: "all 0.1s ease-in-out",
          }}
          _before={{
            content: '""',
            position: "absolute",
            width: "100%",
            height: "2px",
            bottom: "-2px",
            left: "0",
            backgroundColor: isActive(item.path) ? "white" : "transparent",
            visibility: isActive(item.path) ? "visible" : "hidden",
            transition: "all 0.3s ease-in-out",
          }}
          color={isActive(item.path) ? "white" : "gray.200"}
          fontWeight={isActive(item.path) ? "700" : "600"}
          px={4}
        >
          <Text>{item.name}</Text>
        </ChakraLink>
      ))}

      {/* Carrito de compras */}
      <Box position="relative">
        <ChakraLink
          as={Link}
          to="/carrito"
          _hover={{
            textDecoration: "none",
            transform: "scale(1.05)",
            transition: "all 0.1s ease-in-out",
          }}
        >
          {/* Círculo con el ícono del carrito */}
          <Flex
            bg="white"
            borderRadius="full"
            p={1.5} 
            align="center"
            justify="center"
            boxSize="30px" 
            position="relative"
          >
            <Icon as={FaShoppingCart} color="blue.500" boxSize={4} /> 
          </Flex>

          
          {cartItemCount > 0 && (
            <Box
              position="absolute"
              top="-6px"
              right="-6px"
              bg="red.500"
              color="white"
              fontSize="xs"
              borderRadius="ls"
              width="16px" 
              height="16px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold" 
            >
              {cartItemCount}
            </Box>
          )}
        </ChakraLink>
      </Box>
    </Flex>
  );
};

export default NavBar;
