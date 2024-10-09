// src/pages/NotFoundPage.jsx
import { Box, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomButton from '../Components/common/CustomButton';

const MotionBox = motion(Box);

const NotFoundPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box textAlign="center" py={10} px={6} minHeight="100vh" bg={bgColor}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8}>
          <Heading
            display="inline-block"
            as="h2"
            size="2xl"
            bgGradient="linear(to-r, teal.400, teal.600)"
            backgroundClip="text"
          >
            404
          </Heading>
          <Text fontSize="18px" color={textColor}>
            Página no encontrada
          </Text>
          <Text color={textColor}>
            La página que estás buscando no parece existir.
          </Text>
          <MotionBox
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CustomButton
              as={RouterLink}
              to="/"
              colorScheme="teal"
              bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
              color="white"
              variant="solid"
            >
              Volver a la página de inicio
            </CustomButton>
          </MotionBox>
        </VStack>
      </MotionBox>
      <MotionBox
        mt={10}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          fill="none"
          stroke={useColorModeValue('teal.500', 'teal.200')}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </MotionBox>
    </Box>
  );
};

export default NotFoundPage;