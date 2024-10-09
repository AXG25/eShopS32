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
import env from "../config/env";

const MotionBox = motion(Box);

const fetchProducts = async (filters) => {
  const { category, priceRange, sortBy, page = 1, limit = 10 } = filters;
  let url = `${env.PRODUCTS.BASE}?page=${page}&limit=${limit}`;
console.log('filters', filters)
  if (category) {
    url += `&category=${category}`;
  }

  if (priceRange[0] > 0) {
    url += `&minPrice=${priceRange[0]}`;
  }

  if (priceRange[1] < Infinity) {
    url += `&maxPrice=${priceRange[1]}`;
  }

  if (sortBy) {
    const [field, order] = sortBy.split('_');
    url += `&sortBy=${field}&order=${order}`;
  }

  const { data } = await axios.get(url);
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
    page: 1,
    limit: 10,
  });
  const toast = useToast();
  const scrollContainerRef = useRef(null);

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });

  useEffect(() => {
    const selectedCategory = location.state?.selectedCategory;
    if (selectedCategory) {
      setFilters(prev => ({ ...prev, category: selectedCategory }));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      page: 1, // Reset page when filters change
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      priceRange: [0, Infinity],
      category: "",
      sortBy: "",
      page: 1,
      limit: 10,
    });
  }, []);

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
                {productsData.products.map((product) => (
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

          {productsData && productsData.products.length === 0 && !isLoading && (
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

          {/* Aquí puedes agregar la paginación si es necesario */}
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;