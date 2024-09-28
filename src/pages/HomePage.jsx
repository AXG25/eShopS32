import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  SimpleGrid,
  Text,
  Container,
  VStack,
  Heading,
  useToast,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import useStoreConfigStore from "../store/useStoreConfigStore";
import FilterBar from "../Components/product/FilterBar";
import ProductCard from "../Components/product/ProductCard";
import CustomButton from "../Components/common/CustomButton";

const MotionBox = motion(Box);

const fetchProducts = async () => {
  const { data } = await axios.get(`https://fakestoreapi.com/products`);
  return data;
};

const HomePage = () => {
  const { config } = useStoreConfigStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    priceRange: [0, Infinity],
    category: "",
    sortBy: "",
  });
  const toast = useToast();
  const scrollContainerRef = useRef(null);

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    const selectedCategory = location.state?.selectedCategory;
    if (selectedCategory) {
      setFilters(prev => ({ ...prev, category: selectedCategory }));
      // Limpia el estado de la navegación para que no persista al recargar
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      priceRange: [0, Infinity],
      category: "",
      sortBy: "",
    });
  }, []);

  const filteredProducts = useCallback(() => {
    if (!products) return [];
    return products
      .filter((product) => {
        const priceInRange =
          (filters.priceRange[0] === 0 ||
            product.price >= filters.priceRange[0]) &&
          (filters.priceRange[1] === Infinity ||
            product.price <= filters.priceRange[1]);
        const categoryMatch =
          !filters.category || product.category.toLowerCase() === filters.category.toLowerCase();
        return priceInRange && categoryMatch;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price_asc") return a.price - b.price;
        if (filters.sortBy === "price_desc") return b.price - a.price;
        if (filters.sortBy === "name_asc")
          return a.title.localeCompare(b.title);
        if (filters.sortBy === "name_desc")
          return b.title.localeCompare(a.title);
        return 0;
      });
  }, [products, filters]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error al cargar los productos",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const scrollbarStyle = {
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  };

  const filteredProductsList = filteredProducts();

  return (
    <Box
      ref={scrollContainerRef}
      height="calc(100vh - 80px)"
      overflowY="auto"
      sx={scrollbarStyle}
    >
      <Container maxW="container.xl" pb={20}>
        <VStack spacing={8} align="stretch">
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            color={config.primaryColor}
          >
            {filters.category ? `Productos: ${filters.category}` : "Todos los Productos"}
          </Heading>

          <FilterBar
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            products={products || []}
            currentFilters={filters}
          />

          {isLoading ? (
            <Flex justify="center" align="center" height="50vh">
              <Spinner size="xl" color={config.primaryColor} />
            </Flex>
          ) : error ? (
            <VStack spacing={4} align="center">
              <Text color="red.500" fontSize="lg">
                Error: {error.message}
              </Text>
              <CustomButton onClick={() => refetch()} colorScheme="blue">
                Intentar de nuevo
              </CustomButton>
            </VStack>
          ) : (
            <AnimatePresence>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing={6}
              >
                {filteredProductsList.map((product) => (
                  <MotionBox
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductCard product={product} />
                  </MotionBox>
                ))}
              </SimpleGrid>
            </AnimatePresence>
          )}

          {filteredProductsList.length === 0 && !isLoading && (
            <VStack spacing={4} pt={8}>
              <Text
                fontSize="lg"
                fontWeight="medium"
                textAlign="center"
                color="gray.600"
              >
                No se encontraron productos
              </Text>
              <Text fontSize="md" color="gray.500" textAlign="center">
                Intenta ajustar los filtros
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;