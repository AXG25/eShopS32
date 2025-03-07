import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import useStoreConfigStore from "../store/useStoreConfigStore";
import useProductStore from "../store/useProductStore";
import FilterBar from "../Components/product/FilterBar";
import ProductCard from "../Components/product/ProductCard";
import CustomButton from "../Components/common/CustomButton";
import { ErrorBoundary } from "react-error-boundary";

const MotionBox = motion(Box);

// Error fallback component for the ErrorBoundary
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { config } = useStoreConfigStore();
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      borderRadius="md"
      my={4}
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Something went wrong
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {error.message || "An unexpected error occurred while loading products."}
      </AlertDescription>
      <CustomButton
        onClick={resetErrorBoundary}
        mt={4}
        colorScheme="blue"
      >
        Try again
      </CustomButton>
    </Alert>
  );
};

// Loading component for Suspense
const LoadingFallback = () => {
  const { config } = useStoreConfigStore();
  return (
    <Flex justify="center" align="center" height="50vh">
      <Spinner size="xl" color={config.primaryColor} />
    </Flex>
  );
};

const HomePage = () => {
  const { config } = useStoreConfigStore();
  const { fetchProducts, filters, setFilters, clearFilters } = useProductStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [localFilters, setLocalFilters] = useState(() => ({
    priceRange: [
      searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
      searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : Infinity,
    ],
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "",
    search: searchParams.get("search") || "",
    limit: 25,
  }));

  const toast = useToast();
  const scrollContainerRef = useRef(null);
  const { ref, inView } = useInView();
  const isFetchingRef = useRef(false);
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", localFilters],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({ ...localFilters, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.products.length < localFilters.limit) {
        return undefined;
      }
      return pages.length + 1;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onError: (error) => {
      toast({
        title: "Error loading products",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    },
  });
  useEffect(() => {
    const selectedCategory = location.state?.selectedCategory;
    if (selectedCategory) {
      setLocalFilters((prev) => ({ ...prev, category: selectedCategory }));
      setFilters({ ...filters, category: selectedCategory });
      setSearchParams({
        ...Object.fromEntries(searchParams),
        category: selectedCategory,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, searchParams, setSearchParams, setFilters]);
  
  useEffect(() => {
    // Reset the fetching ref when filters change or component mounts
    isFetchingRef.current = false;
  }, [localFilters]);
  useEffect(() => {
    const handleFetchNextPage = async () => {
      // Only fetch if we're in view, have more pages, not currently fetching next page,
      // and our custom ref indicates we're not in the middle of a fetch
      if (inView && hasNextPage && !isFetchingNextPage && !isFetchingRef.current) {
        try {
          // Set our custom ref to true to prevent duplicate requests
          isFetchingRef.current = true;
          await fetchNextPage();
        } finally {
          // Small delay before allowing another fetch to prevent rapid consecutive requests
          setTimeout(() => {
            isFetchingRef.current = false;
          }, 300);
        }
      }
    };

    handleFetchNextPage();
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  const handleFilterChange = useCallback(
    (newFilters) => {
      setLocalFilters(newFilters);
      setFilters(newFilters);

      const searchParamsObject = {};
      if (newFilters.category)
        searchParamsObject.category = newFilters.category;
      if (newFilters.sortBy) searchParamsObject.sortBy = newFilters.sortBy;
      if (newFilters.search) searchParamsObject.search = newFilters.search;
      if (newFilters.priceRange[0] > 0)
        searchParamsObject.minPrice = newFilters.priceRange[0];
      if (
        newFilters.priceRange[1] < Infinity &&
        newFilters.priceRange[1] !== newFilters.priceRange[0]
      ) {
        searchParamsObject.maxPrice = newFilters.priceRange[1];
      }

      setSearchParams(searchParamsObject);
    },
    [setFilters, setSearchParams]
  );
  const handleClearFilters = useCallback(() => {
    clearFilters();
    setLocalFilters({
      priceRange: [0, Infinity],
      category: "",
      sortBy: "",
      search: "",
      limit: 12,
    });
    setSearchParams({});
  }, [setSearchParams, clearFilters]);
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
  // Render products with error boundary
  const renderProducts = () => {
    if (isLoading) {
      return <LoadingFallback />;
    }
    
    if (error) {
      return (
        <VStack spacing={4} align="center">
          <Text color="red.500" fontSize="lg">
            Error: {error.message}
          </Text>
          <CustomButton onClick={() => refetch()} colorScheme="blue">
            Intentar de nuevo
          </CustomButton>
        </VStack>
      );
    }
    
    if (allProducts.length === 0) {
      return (
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
      );
    }
    
    return (
      <AnimatePresence>
        <SimpleGrid
          columns={{ base: 2, lg: 3, xl: 4 }}
          spacing={4}
        >
          {allProducts.map((product) => (
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
    );
  };

  const allProducts = data ? data.pages.flatMap((page) => page.products) : [];
  
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
            size={{ base: "lg", md: "2xl" }}
            textAlign="center"
            color={config.primaryColor}
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            {localFilters.category
              ? `Productos: ${localFilters.category}`
              : "Todos los Productos"}
          </Heading>

          <FilterBar
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            currentFilters={localFilters}
          />

          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // Reset the component state here
              refetch();
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              {renderProducts()}
            </Suspense>
          </ErrorBoundary>

          {isFetchingNextPage && (
            <Flex justify="center" mt={4}>
              <Spinner size="lg" color={config.primaryColor} />
            </Flex>
          )}

          <Box ref={ref} h="20px" />
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;
