import { useState } from "react";
import { useNavigate} from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  useToast,
  Flex,
  Image,
  useColorModeValue,
  Container,
  Divider,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import useStoreConfigStore from "../store/useStoreConfigStore";
import DefaultLogo from "../Components/Layout/DefaultLogo";
import CustomButton from "../Components/common/CustomButton";

// Componentes con animación
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionInput = motion(Input);
const MotionButton = motion(CustomButton);

const LoginPage = () => {
  // Estado para manejar el input de usuario (email o nombre de usuario)
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { config } = useStoreConfigStore();

  // Configuración de colores según el modo (claro/oscuro)
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const logoColor = useColorModeValue("blue.500", "blue.300");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const inputBgColor = useColorModeValue("gray.100", "gray.600");

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determinar si el input es un email o un nombre de usuario
      const isEmail = userInput.includes("@");
      const loginData = isEmail
        ? { email: userInput, password }
        : { username: userInput, password };

      await login(loginData);
      toast({
        title: "Inicio de sesión exitoso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minHeight="100vh"
      width="full"
      bg={bgColor}
      position="relative"
      overflow="hidden"
    >
      <Container
        maxW="lg"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
        position="relative"
      >
        <VStack spacing="8">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CustomButton
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              variant="ghost"
              color={textColor}
              _hover={{ bg: "whiteAlpha.200" }}
            >
              Volver a la página principal
            </CustomButton>
          </MotionBox>
          <MotionBox
            py="8"
            px={{ base: "4", md: "10" }}
            bg={cardBgColor}
            boxShadow="2xl"
            borderRadius="xl"
            width="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <VStack spacing="6" align="stretch">
              <MotionFlex
                justify="center"
                align="center"
                direction="column"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {config.logo ? (
                  <Image src={config.logo} alt="Logo" maxHeight="80px" mb={4} />
                ) : (
                  <DefaultLogo color={logoColor} boxSize="60px" mb={4} />
                )}
                <Heading
                  size="xl"
                  fontWeight="extrabold"
                  mb={2}
                  textAlign="center"
                >
                  Bienvenido de vuelta
                </Heading>
                <Text fontSize="md" color={textColor} textAlign="center">
                  Accede a tu panel de {config.title || "E-commerce"}
                </Text>
              </MotionFlex>
              <form onSubmit={handleSubmit}>
                <VStack spacing="5">
                  <FormControl id="userInput">
                    <FormLabel>Email o nombre de usuario</FormLabel>
                    <MotionInput
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="tu@email.com o tu nombre de usuario"
                      required
                      bg={inputBgColor}
                      borderColor="transparent"
                      _hover={{ borderColor: "blue.300" }}
                      _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Contraseña</FormLabel>
                    <InputGroup>
                      <MotionInput
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                        bg={inputBgColor}
                        borderColor="transparent"
                        _hover={{ borderColor: "blue.300" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "outline",
                        }}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      />
                      <InputRightElement width="4.5rem">
                        <CustomButton
                          h="1.75rem"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </CustomButton>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <MotionButton
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    size="lg"
                    fontSize="md"
                    isLoading={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Iniciar Sesión
                  </MotionButton>
                </VStack>
              </form>

              <Divider />

             {/*  <HStack justify="center" spacing="1" fontSize="sm">
                <Text color={textColor}>¿No tienes una cuenta?</Text>
                <CustomButton
                  variant="link"
                  colorScheme="blue"
                  as={RouterLink}
                  to="/register"
                >
                  Regístrate
                </CustomButton>
              </HStack> */}
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;
