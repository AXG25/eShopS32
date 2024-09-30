import {
  Box,
  SimpleGrid,
  Container,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CategoryItem from "../Components/product/CategoryItem";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white.50", "white.900");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const categories = [
    { id: "bebidas", name: "Bebidas", icon: "FaCocktail" },
    { id: "compuesto-e-iva", name: "Compuesto e IVA", icon: "FaReceipt" },
    { id: "dorilocos", name: "Dorilocos", icon: "GiTacos" },
    { id: "hamburguesas", name: "Hamburguesas", icon: "FaHamburger" },
    { id: "pescados", name: "Pescados", icon: "FaFish" },
    { id: "teclados", name: "Teclados", icon: "FaKeyboard" },
  ];

  const handleCategoryClick = (categoryId) => {
    navigate("/home", { state: { selectedCategory: categoryId } });
  };

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
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default CategoriesPage;
