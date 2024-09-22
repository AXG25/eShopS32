import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
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
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useStoreConfigStore from '../store/useStoreConfigStore';
import DefaultLogo from '../Components/Layout/DefaultLogo';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionInput = motion(Input);
const MotionButton = motion(Button);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { config } = useStoreConfigStore();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const logoColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const inputBgColor = useColorModeValue('gray.100', 'gray.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error de autenticación',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minHeight="100vh" width="full" bg={bgColor} position="relative" overflow="hidden">
      <MotionBox
     /*    position="absolute"
        top="-10%"
        left="-10%"
        width="120%"
        height="120%"
        bgGradient="linear(to-r, blue.400, purple.500)"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        style={{ borderRadius: '50%' }} */
      />
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }} position="relative">
        <VStack spacing="8">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              variant="ghost"
              color={textColor}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Volver a la página principal
            </Button>
          </MotionBox>
          <MotionBox
            py="8"
            px={{ base: '4', md: '10' }}
            bg={cardBgColor}
            boxShadow="2xl"
            borderRadius="xl"
            width="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <VStack spacing="6" align="stretch">
              <MotionFlex justify="center" align="center" direction="column"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {config.logo ? (
                  <Image src={config.logo} alt="Logo" maxHeight="80px" mb={4} />
                ) : (
                  <DefaultLogo color={logoColor} boxSize="60px" mb={4} />
                )}
                <Heading size="xl" fontWeight="extrabold" mb={2} textAlign="center">
                  Bienvenido de vuelta
                </Heading>
                <Text fontSize="md" color={textColor} textAlign="center">
                  Accede a tu panel de {config.title || "E-commerce"}
                </Text>
              </MotionFlex>
              <form onSubmit={handleSubmit}>
                <VStack spacing="5">
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <MotionInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      bg={inputBgColor}
                      borderColor="transparent"
                      _hover={{ borderColor: 'blue.300' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
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
                        _hover={{ borderColor: 'blue.300' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
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

              <HStack justify="center" spacing="1" fontSize="sm">
                <Text color={textColor}>¿No tienes una cuenta?</Text>
                <Button variant="link" colorScheme="blue" as={RouterLink} to="/register">
                  Regístrate
                </Button>
              </HStack>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;