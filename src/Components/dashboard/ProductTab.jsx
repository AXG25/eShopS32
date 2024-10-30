import PropTypes from "prop-types";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Image,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Flex,
  useToast,
  Spinner,
  Tooltip,
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import CustomButton from "../common/CustomButton";
import ImageUpload from "../common/ImageUpload";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import useProductStore from "../../store/useProductStore";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import FilterBar from "../product/FilterBar";
import { DEFAULT_IMAGE } from "../../constants/images";
import axios from "axios";
import env from "../../config/env";

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const fetchCategories = async () => {
    const response = await axios.get(env.PRODUCTS.CATEGORIES);
    return response.data || [];
  };

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        image: product.image || DEFAULT_IMAGE,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageData) => {
    if (imageData) {
      setFormData(prev => ({
        ...prev,
        image: imageData
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {product ? t("products.editProduct") : t("products.addNewProduct")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box flex="3" pr={8}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>{t("products.productName")}</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{t("general.description")}</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </FormControl>
                <HStack>
                  <FormControl isRequired>
                    <FormLabel>{t("general.price")}</FormLabel>
                    <Input
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t("general.category")}</FormLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">{t("products.selectCategory")}</option>
                      {categories && categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>
              </VStack>
            </Box>
            <Box flex="2">
              <FormControl>
                <FormLabel>{t("products.productImage")}</FormLabel>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  initialImage={formData.image}
                />
              </FormControl>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <CustomButton onClick={handleSubmit} colorScheme="blue" mr={3}>
            {product ? t("general.update") : t("general.add")}
          </CustomButton>
          <CustomButton variant="ghost" onClick={onClose}>
            {t("general.cancel")}
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ProductTab = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentProduct, setCurrentProduct] = useState(null);
  const toast = useToast();
  const { config } = useStoreConfigStore();
  const { fetchProducts, filters, setFilters, clearFilters, deleteProduct, addProduct, updateProduct } =
    useProductStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
    limit: 12,
  }));
  const scrollContainerRef = useRef(null);
  const { ref, inView } = useInView();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const cancelRef = useRef();

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
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

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




  const handleSave = async (productData) => {
    try {
      if (currentProduct?.id) {
        await updateProduct({ ...currentProduct, ...productData });
        toast({
          title: t("products.productUpdated"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addProduct(productData);
        toast({
          title: t("products.productAdded"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      refetch(); // Volver a cargar los productos
    } catch (error) {
      toast({
        title: "Error al guardar el producto",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = useCallback(
    (product) => {
      setCurrentProduct({...product}); // Crea una nueva referencia del objeto
      onOpen();
    },
    [onOpen]
  );

  const handleDelete = useCallback(
    (id) => {
      setProductToDelete(id);
      setIsAlertOpen(true);
    },
    []
  );

  const confirmDelete = async () => {
    try {
      await deleteProduct(productToDelete);
      setIsAlertOpen(false);
      toast({
        title: t("products.productDeleted"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      refetch(); // Volver a cargar los productos
    } catch (error) {
      setIsAlertOpen(false);
      toast({
        title: "Error al eliminar el producto",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const allProducts = data ? data.pages.flatMap((page) => page.products) : [];

  return (
    <Box
      position="relative"
      ref={scrollContainerRef}
      height="calc(100vh - 80px)"
      overflowY="auto"
      sx={scrollbarStyle}
    >
      <FilterBar
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        currentFilters={localFilters}
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
        <Box>
          <CustomButton
            onClick={() => {
              setCurrentProduct(null);
              onOpen();
            }}
            mb={4}
          >
            {t("products.addNewProduct")}
          </CustomButton>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t("general.image")}</Th>
                <Th>{t("general.name")}</Th>
                <Th>{t("general.price")}</Th>
                <Th>{t("general.category")}</Th>
                <Th>{t("general.actions")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allProducts.map((product) => (
                <Tr key={product.id}>
                  <Td>
                    <Image
                      src={product.image || DEFAULT_IMAGE}
                      alt={product.title}
                      boxSize="50px"
                      objectFit="cover"
                    />
                  </Td>
                  <Td>{product.title}</Td>
                  <Td>
                    ${product.price}
                  </Td>
                  <Td>{product.category}</Td>
                  <Td display="flex" justifyContent="flex-end">
                    <Tooltip label={t("general.edit")}>
                      <CustomButton
                        size="sm"
                        onClick={() => handleEdit(product)}
                        mr={2}
                      >
                        {<AiFillEdit />}
                      </CustomButton>
                    </Tooltip>
                    <Tooltip label={t("general.delete")}>
                      <CustomButton
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        {<RiDeleteBin2Fill />}
                      </CustomButton>
                    </Tooltip>
                  </Td>
                </Tr>
              ))}

              {isFetchingNextPage && (
                <Flex justify="center" mt={4}>
                  <Spinner size="lg" color={config.primaryColor} />
                </Flex>
              )}
            </Tbody>
          </Table>

          {allProducts.length === 0 && !isLoading && (
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

          <ProductModal
            isOpen={isOpen}
            onClose={onClose}
            product={currentProduct}
            onSave={handleSave}
          />
        </Box>
      )}
      <Box ref={ref} h="20px" />

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("products.confirmDelete")}
            </AlertDialogHeader>


            <AlertDialogFooter>
              <CustomButton ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                {t("general.cancel")}
              </CustomButton>
              <CustomButton colorScheme="red" onClick={confirmDelete} ml={3}>
                {t("general.delete")}
              </CustomButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    image: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

ProductModal.defaultProps = {
  product: null,
};

export default ProductTab;
