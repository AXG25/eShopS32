import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaHandshake, FaLeaf } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import CustomButton from '../Components/common/CustomButton';
import PropTypes from 'prop-types';

const MotionBox = motion(Box);

const ValueCard = ({ icon, title, description }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    p={5}
    shadow="md"
    borderWidth="1px"
    borderRadius="md"
    bg={useColorModeValue('white', 'gray.700')}
  >
    <VStack spacing={3} align="center">
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Text fontWeight="bold" fontSize="lg">
        {title}
      </Text>
      <Text textAlign="center">{description}</Text>
    </VStack>
  </MotionBox>
);

const AboutUsPage = () => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center" mb={6}>
            {t('about.aboutUsTitle')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Image
              src="/path-to-your-company-image.jpg"
              alt="Nuestra empresa"
              borderRadius="lg"
              objectFit="cover"
              h="400px"
            />
            <VStack align="start" justify="center" spacing={6}>
              <Heading as="h2" size="xl">
                {t('about.ourHistory')}
              </Heading>
              <Text color={textColor}>
                {t('about.historyText')}
              </Text>
              <CustomButton>{t('about.learnMore')}</CustomButton>
            </VStack>
          </SimpleGrid>

          <Box>
            <Heading as="h2" size="xl" textAlign="center" mb={8}>
              {t('about.ourMission')}
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="2xl" mx="auto" color={textColor}>
              {t('about.missionText')}
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="xl" textAlign="center" mb={8}>
              {t('about.ourValues')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <ValueCard
                icon={FaUsers}
                title={t('about.teamwork')}
                description={t('teamworkDesc')}
              />
              <ValueCard
                icon={FaLightbulb}
                title={t('about.innovation')}
                description={t('about.innovationDesc')}
              />
              <ValueCard
                icon={FaHandshake}
                title={t('about.integrity')}
                description={t('about.integrityDesc')}
              />
              <ValueCard
                icon={FaLeaf}
                title={t('about.sustainability')}
                description={t('about.sustainabilityDesc')}
              />
            </SimpleGrid>
          </Box>

          <Box textAlign="center">
            <Heading as="h2" size="xl" mb={6}>
              {t('about.joinOurTeam')}
            </Heading>
            <Text fontSize="lg" mb={6} color={textColor}>
              {t('about.joinTeamText')}
            </Text>
            <CustomButton size="lg">{t('about.viewOpenings')}</CustomButton>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

ValueCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default AboutUsPage;