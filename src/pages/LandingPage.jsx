import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  SimpleGrid,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import Footer from "../Components/Layout/Footer";
import ContactUsPage from "./ContactUsPage";
import useStoreConfigStore from "../store/useStoreConfigStore";
import PropTypes from "prop-types";
import CustomButton from "../Components/common/CustomButton";
import DynamicIcon from "../Components/common/DynamicIcon";

const MotionBox = motion(Box);

const FeatureCard = ({ icon, title, description }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }}
    p={6}
    borderRadius="lg"
    boxShadow="md"
    bg={useColorModeValue("white", "gray.700")}
  >
    <DynamicIcon name={icon} w={10} h={10} color="teal.500" mb={4} />
    <Heading size="md" mb={2}>
      {title}
    </Heading>
    <Text>{description}</Text>
  </MotionBox>
);

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const LandingPage = () => {
  const { config } = useStoreConfigStore();
  const { landingPage } = config;

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const primaryColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Box bg={bgColor}>
      {/* Hero Section */}
      <Box
        bgGradient={landingPage.heroBgGradient}
        color={landingPage.heroTextColor}
        py={20}
      >
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
          >
            <VStack align="flex-start" spacing={6} maxW="lg">
              <Heading as="h1" size="2xl">
                {landingPage.heroTitle}
              </Heading>
              <Text fontSize="xl">{landingPage.heroSubtitle}</Text>
              <CustomButton
                as={RouterLink}
                to="/home"
                colorScheme={landingPage.heroButtonColorScheme}
                size="lg"
              >
                {landingPage.heroButtonText}
              </CustomButton>
            </VStack>
            <Image
              src={landingPage.heroImage}
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
            {landingPage.featuresTitle}
          </Heading>
          <Text fontSize="xl" textAlign="center" mb={10} maxW="800px" mx="auto">
            {landingPage.featuresSubtitle}
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={10}
            justifyItems="center"
          >
            {landingPage.features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Contact Us Section */}
      <Box py={20}>
        <ContactUsPage />
      </Box>

      <Footer />
    </Box>
  );
};

export default LandingPage;
