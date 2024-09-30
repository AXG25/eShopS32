// src/components/product/CategoryNavigation.jsx
import { useState, useEffect } from "react";
import { Box, Button, HStack, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

// Simula una llamada a la API para obtener las categorías
const fetchCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Electrónica", "Ropa", "Hogar", "Deportes", "Libros"]);
    }, 500);
  });
};

const CategoryNavigation = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const bgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <Box bg={bgColor} p={4} mb={4} overflowX="auto">
      <HStack spacing={4}>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => handleCategoryClick(category)}
            variant={selectedCategory === category ? "solid" : "outline"}
            colorScheme="blue"
            size="sm"
          >
            {category}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

CategoryNavigation.propTypes = {
  onSelectCategory: PropTypes.func,
};

export default CategoryNavigation;
