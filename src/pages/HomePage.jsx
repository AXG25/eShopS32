import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Container,
  VStack,
  Heading,
  useToast,
  Spinner,
  Fade,
  Divider,
} from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useStoreConfigStore from '../store/useStoreConfigStore';
import InfiniteProductSlider from '../Components/product/InfiniteProductSlider';
import FilterBar from '../Components/product/FilterBar';
import ProductCard from '../Components/product/ProductCard';

const MotionBox = motion(Box);

const fetchProducts = async ({ pageParam = 1, filters }) => {
  const { data } = await axios.get(`https://fakestoreapi.com/products`, {
    params: {
      ...filters,
      _page: pageParam,
      _limit: 12,
    },
  });
  return {
    data,
    nextPage: data.length === 12 ? pageParam + 1 : undefined,
  };
};

const HomePage = () => {
  const { config } = useStoreConfigStore();
  const [filters, setFilters] = useState({});
  const toast = useToast();
  const loadMoreRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam, filters }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
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
    '&::-webkit-scrollbar': {
      width: '1px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  };

  return (
    <Box
      ref={scrollContainerRef}
      height="calc(100vh - 80px)" // Ajusta esto según el tamaño de tu header
      overflowY="auto"
      sx={scrollbarStyle}
    >
      <Container maxW="container.xl" pb={20}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center" color={config.primaryColor}>
            Nuestros Productos
          </Heading>
          
      {/*     <Box>
            <Heading as="h2" size="lg" mb={4}>Productos Destacados</Heading>
            <InfiniteProductSlider />
          </Box> */}
          
          <FilterBar onFilterChange={handleFilterChange} />

          {status === 'pending' ? (
            <Spinner size="xl" alignSelf="center" />
          ) : status === 'error' ? (
            <Text color="red.500" textAlign="center">Error: {error.message}</Text>
          ) : (
            <AnimatePresence>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                {data.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.data.map((product) => (
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
                  </React.Fragment>
                ))}
              </SimpleGrid>
            </AnimatePresence>
          )}

          <Box ref={loadMoreRef} h="20px" />
          
          <Fade in={isFetchingNextPage}>
            <Spinner size="md" alignSelf="center" />
          </Fade>

          {!hasNextPage && data?.pages.length > 0 && (
            <VStack spacing={4} pt={8}>
              <Divider />
              <Text fontSize="lg" fontWeight="medium" textAlign="center" color="gray.600">
                Has llegado al final de la lista
              </Text>
              <Text fontSize="md" color="gray.500" textAlign="center">
                No hay más productos para mostrar
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;