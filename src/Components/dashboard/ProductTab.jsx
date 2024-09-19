/**
 * @fileoverview Componente ProductTab para gestionar productos en el dashboard de administración.
 * @module ProductTab
 */

import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Text,
  Spinner,
  useToast,
  Image,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import axios from "axios";

/**
 * Fetches products from the Fake Store API.
 * @async
 * @function fetchProducts
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 */
const fetchProducts = async () => {
  const { data } = await axios.get("https://fakestoreapi.com/products");
  return data;
};

/**
 * ProductTab component for managing products.
 * @function ProductTab
 * @returns {JSX.Element} The rendered ProductTab component.
 */
export const ProductTab = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentProduct.id) {
      updateMutation.mutate(currentProduct);
    } else {
      addMutation.mutate(currentProduct);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t("confirmDelete"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setCurrentProduct({ ...currentProduct, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    },
    [currentProduct]
  );

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <Text color="red.500">
        {t("errorLoadingProducts")}: {error.message}
      </Text>
    );

  return (
    <Box>
      <Button
        onClick={() => {
          setCurrentProduct({});
          setImagePreview(null);
          onOpen();
        }}
        mb={4}
      >
        {t("addNewProduct")}
      </Button>

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
                <Image
                  src={product.image}
                  alt={product.title}
                  boxSize="50px"
                  objectFit="cover"
                />
              </Td>
              <Td>{product.title}</Td>
              <Td>${product.price.toFixed(2)}</Td>
              <Td>{product.category}</Td>
              <Td>
                <Button
                  size="sm"
                  onClick={() => {
                    setCurrentProduct(product);
                    setImagePreview(product.image);
                    onOpen();
                  }}
                  mr={2}
                >
                  {t("edit")}
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(product.id)}
                >
                  {t("delete")}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentProduct?.id ? t("editProduct") : t("addNewProduct")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>{t("productImage")}</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      mt={2}
                      boxSize="100px"
                      objectFit="cover"
                    />
                  )}
                </FormControl>
                <Input
                  placeholder={t("productName")}
                  value={currentProduct?.title || ""}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      title: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder={t("price")}
                  type="number"
                  value={currentProduct?.price || ""}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
                <Select
                  placeholder={t("selectCategory")}
                  value={currentProduct?.category || ""}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="electronics">{t("electronics")}</option>
                  <option value="jewelery">{t("jewelery")}</option>
                  <option value="men's clothing">{t("men'sClothing")}</option>
                  <option value="women's clothing">
                    {t("women'sClothing")}
                  </option>
                </Select>
                <Input
                  placeholder={t("description")}
                  value={currentProduct?.description || ""}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                />
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {currentProduct?.id ? t("update") : t("add")}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              {t("cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
