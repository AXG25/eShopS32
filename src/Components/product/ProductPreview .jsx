import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import useCartStore from '../../store/useCartStore';

const ProductPreview = ({ isOpen, onClose, product }) => {
  const { addItemToCart} = useCartStore();

  const handleAddToCart = () => {
    addItemToCart(product);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Image src={product.image} alt={product.title} objectFit="contain" maxH="300px" />
            <Text fontWeight="bold">Precio: €{product.price.toFixed(2)}</Text>
            <Text>{product.description}</Text>
            <Text>Categoría: {product.category}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAddToCart}>
            Añadir al carrito
          </Button>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductPreview;