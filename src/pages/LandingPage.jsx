import PropTypes from "prop-types";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  SimpleGrid,
  useColorModeValue,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { FaHeadset, FaRocket, FaUser } from "react-icons/fa";
import Footer from "../Components/Layout/Footer";
import ContactUsPage from "./ContactUsPage";
import InfiniteProductSlider from "../Components/product/InfiniteProductSlider";

const MotionBox = motion(Box);

const FeatureCard = ({ icon, title, description }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }}
    p={6}
    borderRadius="lg"
    boxShadow="md"
    bg={useColorModeValue("white", "gray.700")}
  >
    <Icon as={icon} w={10} h={10} color="teal.500" mb={4} />
    <Heading size="md" mb={2}>
      {title}
    </Heading>
    <Text>{description}</Text>
  </MotionBox>
);

const LandingPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const primaryColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Box bg={bgColor}>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r, teal.500, blue.500)" color="white" py={20}>
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
          >
            <VStack align="flex-start" spacing={6} maxW="lg">
              <Heading as="h1" size="2xl">
                Software administrativo enterprise
              </Heading>
              <Text fontSize="xl">
                la solución informática pensada para su empresa
              </Text>
              <Button as={RouterLink} to="/home" colorScheme="teal" size="lg">
                Explorar Productos
              </Button>
            </VStack>
            <Image
              src="/featured-product.png"
              alt="Featured Product"
              maxW="400px"
              mt={{ base: 10, md: 0 }}
            />
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Heading textAlign="center" mb={4} color={primaryColor}>
            Por qué elegirnos
          </Heading>
          <Text fontSize="xl" textAlign="center" mb={10} maxW="800px" mx="auto">
            16 años de experiencia en la industria del software administrativo y
            punto de venta nos ha permitido entender y cubrir las necesidades de
            nuestros clientes
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={10}
            justifyItems="center"
          >
            <FeatureCard
              icon={FaUser}
              title="Implementaciones con compromiso"
              description="Al adquirir uno de nuestros productos va a experimentar cómo nuestros analistas de soportes y los distribuidores autorizados le dan el acompañamiento que necesite."
            />
            <FeatureCard
              icon={FaRocket}
              title="System32 es fácil de usar"
              description="Nuestra interfaz de usuario está detalladamente trabajada para que su aprendizaje sea intuitivo. Desde su creación nuestro software se ha caracterizado por su diseño."
            />
            <FeatureCard
              icon={FaHeadset}
              title="Soporte técnico de valor"
              description="Constantemente capacitamos a nuestro personal y a nuestros distribuidores con los programas informáticos de System32 para que puedan dar respuesta oportuna y eficaz para evitar que su empresa se mantenga operativa."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box bg={useColorModeValue("white", "gray.800")} py={20}>
        <Container maxW="container.xl">
          <Heading textAlign="center" mb={10} color={primaryColor}>
            Productos Destacados
          </Heading>
          <InfiniteProductSlider />
        </Container>
      </Box>

      {/* Contact Us Section */}
      <Box py={20}>
        <ContactUsPage />
      </Box>

      {/* CTA Section */}
      <Box bg={useColorModeValue("teal.100", "teal.900")} py={20}>
        <Container maxW="container.xl" textAlign="center">
          <Heading mb={4} color={textColor}>
            ¿Listo para comprar?
          </Heading>
          <Text fontSize="xl" mb={8} color={textColor}>
            Regístrate ahora y obtén un 10% de descuento en tu primera compra.
          </Text>
          <Button as={RouterLink} to="/register" colorScheme="teal" size="lg">
            Registrarse
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};
FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default LandingPage;
