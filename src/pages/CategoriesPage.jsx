import {
  Box,
  SimpleGrid,
  Container,
  Heading,
  useColorModeValue,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CategoryItem from "../Components/product/CategoryItem";

import axios from 'axios';
import env from "../config/env";
import { useQuery } from "@tanstack/react-query";

const fetchCategories = async () => {
  const allCategoriesUrl = env.PRODUCTS.CATEGORIES;
  const { data } = await axios.get(allCategoriesUrl);
  return data;
};

const CategoriesPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const handleCategoryClick = (categoryId) => {
    navigate("/home", { state: { selectedCategory: categoryId } });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Text color="red.500">Error al cargar las categorías: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Heading as="h1" size="2xl" textAlign="center" mb={8} color={textColor}>
          Explora nuestras Categorías
        </Heading>
        <SimpleGrid
          columns={{ base: 2, sm: 3, md: 4, lg: 6 }}
          spacing={4}
          px={4}
        >
          {categories && categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default CategoriesPage;