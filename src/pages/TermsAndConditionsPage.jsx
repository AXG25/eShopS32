import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  UnorderedList, 
  ListItem, 
  Button, 
  useColorModeValue,
  Divider,
  Flex
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const TermsAndConditionsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const buttonColorScheme = useColorModeValue('blue', 'teal');

  const sectionStyle = {
    backgroundColor: useColorModeValue('white', 'gray.800'),
    borderRadius: 'lg',
    p: 6,
    boxShadow: 'md',
    mb: 6,
  };

  return (
    <Box bg={bgColor} minHeight="100vh" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="2xl" color={headingColor}>
              {t('termsAndConditions')}
            </Heading>
            <Button
              leftIcon={<FaHome />}
              colorScheme={buttonColorScheme}
              onClick={() => navigate('/')}
              size="lg"
            >
              {t('backToHome')}
            </Button>
          </Flex>

          <Divider />

          <Box {...sectionStyle}>
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
              {t('introduction')}
            </Heading>
            <Text color={textColor}>{t('termsIntroduction')}</Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
              {t('useOfService')}
            </Heading>
            <Text color={textColor}>{t('useOfServiceDescription')}</Text>
            <UnorderedList mt={4} spacing={2}>
              <ListItem>{t('useOfServiceItem1')}</ListItem>
              <ListItem>{t('useOfServiceItem2')}</ListItem>
              <ListItem>{t('useOfServiceItem3')}</ListItem>
            </UnorderedList>
          </Box>

          <Box {...sectionStyle}>
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
              {t('privacyPolicy')}
            </Heading>
            <Text color={textColor}>{t('privacyPolicyDescription')}</Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
              {t('intellectualProperty')}
            </Heading>
            <Text color={textColor}>{t('intellectualPropertyDescription')}</Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
              {t('limitationOfLiability')}
            </Heading>
            <Text color={textColor}>{t('limitationOfLiabilityDescription')}</Text>
          </Box>

          <Box {...sectionStyle}>
            <Heading as="h2" size="lg" mb={4} color={headingColor}>
              {t('governingLaw')}
            </Heading>
            <Text color={textColor}>{t('governingLawDescription')}</Text>
          </Box>

          <Flex justifyContent="center" mt={8}>
            <Button
              leftIcon={<FaHome />}
              colorScheme={buttonColorScheme}
              onClick={() => navigate('/')}
              size="lg"
            >
              {t('backToHome')}
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default TermsAndConditionsPage;