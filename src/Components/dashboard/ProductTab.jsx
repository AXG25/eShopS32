import { useState, useCallback } from "react";
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
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CustomButton from "../common/CustomButton";
import ImageUpload from "../common/ImageUpload";

const fetchProducts = async () => {
  const { data } = await axios.get("https://fakestoreapi.com/products");
  return data;
};

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState(product || {
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageData) => {
    setFormData((prev) => ({ ...prev, image: imageData }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product ? t("editProduct") : t("addNewProduct")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box flex="3" pr={8}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>{t("productName")}</FormLabel>
                  <Input name="title" value={formData.title} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{t("description")}</FormLabel>
                  <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
                </FormControl>
                <HStack>
                  <FormControl isRequired>
                    <FormLabel>{t("price")}</FormLabel>
                    <Input name="price" type="number" value={formData.price} onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t("category")}</FormLabel>
                    <Select name="category" value={formData.category} onChange={handleChange}>
                      <option value="">{t("selectCategory")}</option>
                      <option value="electronics">{t("electronics")}</option>
                      <option value="jewelery">{t("jewelery")}</option>
                      <option value="men's clothing">{t("menClothing")}</option>
                      <option value="women's clothing">{t("womenClothing")}</option>
                    </Select>
                  </FormControl>
                </HStack>
              </VStack>
            </Box>
            <Box flex="2">
              <FormControl>
                <FormLabel>{t("productImage")}</FormLabel>
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
            {product ? t("update") : t("add")}
          </CustomButton>
          <CustomButton variant="ghost" onClick={onClose}>
            {t("cancel")}
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
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const addMutation = useMutation({
    mutationFn: (newProduct) => {
      // Simulate adding a product
      return Promise.resolve({ ...newProduct, id: Date.now() });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["products"], (oldData) => [...oldData, data]);
      toast({ title: t("productAdded"), status: "success" });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedProduct) => {
      // Simulate updating a product
      return Promise.resolve(updatedProduct);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["products"], (oldData) =>
        oldData.map((item) => (item.id === data.id ? data : item))
      );
      toast({ title: t("productUpdated"), status: "success" });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      // Simulate deleting a product
      return Promise.resolve(id);
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["products"], (oldData) =>
        oldData.filter((item) => item.id !== id)
      );
      toast({ title: t("productDeleted"), status: "success" });
    },
  });

  const handleSave = (productData) => {
    if (currentProduct?.id) {
      updateMutation.mutate({ ...currentProduct, ...productData });
    } else {
      addMutation.mutate(productData);
    }
  };

  const handleEdit = useCallback((product) => {
    setCurrentProduct(product);
    onOpen();
  }, [onOpen]);

  const handleDelete = useCallback((id) => {
    if (window.confirm(t("confirmDelete"))) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation, t]);

  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">{t("errorLoadingProducts")}: {error.message}</Text>;

  return (
    <Box>
      <CustomButton onClick={() => { setCurrentProduct(null); onOpen(); }} mb={4}>
        {t("addNewProduct")}
      </CustomButton>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t("image")}</Th>
            <Th>{t("name")}</Th>
            <Th>{t("price")}</Th>
            <Th>{t("category")}</Th>
            <Th>{t("actions")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              <Td>
                <Image src={product.image} alt={product.title} boxSize="50px" objectFit="cover" />
              </Td>
              <Td>{product.title}</Td>
              <Td>${product.price.toFixed(2)}</Td>
              <Td>{product.category}</Td>
              <Td>
                <CustomButton size="sm" onClick={() => handleEdit(product)} mr={2}>
                  {t("edit")}
                </CustomButton>
                <CustomButton size="sm" colorScheme="red" onClick={() => handleDelete(product.id)}>
                  {t("delete")}
                </CustomButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ProductModal
        isOpen={isOpen}
        onClose={onClose}
        product={currentProduct}
        onSave={handleSave}
      />
    </Box>
  );
};

export default ProductTab;