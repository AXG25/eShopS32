import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaHeart, FaSearch } from 'react-icons/fa';
import useCartStore from '../../store/useCartStore';
import useProductStore from '../../store/useProductStore';

const MotionBox = motion(Box);

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCartStore();
  const { updateProductLikes } = useProductStore();
  const [selectedSize, setSelectedSize] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Si el producto es undefined o null, no renderizamos nada
  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      toast({
        title: "Selecciona una talla",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    addItemToCart({ ...product, size: selectedSize });
    toast({
      title: "Producto añadido al carrito",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleLike = () => {
    updateProductLikes(product.id, (product.likes || 0) + 1);
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : 'Precio no disponible';
  };

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <>
      <MotionBox
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <VStack spacing={4} align="stretch">
          <Box position="relative" height="200px">
            <Image 
              src={product.image} 
              alt={product.title} 
              objectFit="cover"
              width="100%"
              height="100%"
              fallbackSrc="https://via.placeholder.com/200" // Imagen de respaldo
            />
            {product.discount > 0 && (
              <Badge position="absolute" top={2} right={2} colorScheme="red">
                {product.discount}% Off
              </Badge>
            )}
            <HStack position="absolute" top={2} left={2} spacing={2}>
              <Icon as={FaHeart} color="red.500" />
              <Text color="white" fontWeight="bold" textShadow="1px 1px 3px rgba(0,0,0,0.6)">
                {product.likes || 0}
              </Text>
            </HStack>
            <Button 
              position="absolute"
              bottom={2}
              right={2}
              size="sm"
              colorScheme="blue"
              onClick={onOpen}
            >
              <Icon as={FaSearch} />
            </Button>
          </Box>
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" noOfLines={2}>
              {product.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {product.category}
            </Text>
            <HStack>
              <Text fontWeight="bold" color={product.discount > 0 ? "red.500" : "black"}>
                €{formatPrice(discountedPrice)}
              </Text>
              {product.discount > 0 && (
                <Text as="s" color="gray.500">
                  €{formatPrice(product.price)}
                </Text>
              )}
            </HStack>
          </VStack>
          {product.sizes && (
            <HStack wrap="wrap" justify="center">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  size="sm"
                  variant={selectedSize === size ? "solid" : "outline"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </HStack>
          )}
          <HStack justify="space-between">
            <Button colorScheme="blue" onClick={handleAddToCart} flex={1}>
              Añadir al carrito
            </Button>
            <Button colorScheme="red" onClick={handleLike}>
              <Icon as={FaHeart} />
            </Button>
          </HStack>
        </VStack>
      </MotionBox>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{product.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image 
              src={product.image} 
              alt={product.title} 
              objectFit="contain"
              width="100%"
              height="400px"
              fallbackSrc="https://via.placeholder.com/400" // Imagen de respaldo
            />
            <Text mt={4}>{product.description}</Text>
            <HStack mt={4}>
              <Text fontWeight="bold">Precio:</Text>
              <Text fontWeight="bold" color={product.discount > 0 ? "red.500" : "black"}>
                €{formatPrice(discountedPrice)}
              </Text>
              {product.discount > 0 && (
                <Text as="s" color="gray.500">
                  €{formatPrice(product.price)}
                </Text>
              )}
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddToCart}>
              Añadir al carrito
            </Button>
            <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;