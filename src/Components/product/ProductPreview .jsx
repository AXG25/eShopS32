import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Divider,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import CustomButton from "../common/CustomButton";

const ProductPreview = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const modalBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      quantity: quantity,
    });
    onClose();
  };

  const formatPrice = (price) => {
    const priceNumber = parseFloat(price, { defaultValu: 0 });
    return priceNumber.toFixed(2);
  };

  const discountedPrice = product.discount
    ? parseFloat(product.price, { defaultValu: 0 }) *
      (1 - parseFloat(product.discount, { defaultValu: 0 }) / 100)
    : parseFloat(product.price, { defaultValu: 0 });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalCloseButton />
        <ModalBody p={6}>
          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            <Box flex={1}>
              <Image
                src={product.image}
                alt={product.title}
                objectFit="contain"
                width="100%"
                height="300px"
                borderRadius="md"
              />
            </Box>
            <VStack align="stretch" flex={1} spacing={4}>
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {product.title}
                </Text>
                <Text color="gray.500">{product.category}</Text>
              </VStack>

              <Text color={textColor}>{product.description}</Text>

              <HStack justify="space-between">
                <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                  €{formatPrice(discountedPrice)}
                </Text>
                {product.discount > 0 && (
                  <Text as="s" fontSize="xl" color="gray.500">
                    €{formatPrice(product.price)}
                  </Text>
                )}
              </HStack>

              {product.sizes && (
                <Box>
                  <Text fontWeight="bold" mb={2} color={textColor}>
                    SIZE
                  </Text>
                  <SimpleGrid columns={6} spacing={2}>
                    {product.sizes.map((size) => (
                      <CustomButton
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        variant={selectedSize === size ? "solid" : "outline"}
                        size="sm"
                      >
                        {size}
                      </CustomButton>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {product.colors && (
                <Box>
                  <Text fontWeight="bold" mb={2} color={textColor}>
                    COLOR
                  </Text>
                  <HStack spacing={2}>
                    {product.colors.map((color) => (
                      <Tooltip key={color} label={color} hasArrow>
                        <Box
                          w="30px"
                          h="30px"
                          borderRadius="full"
                          bg={color}
                          onClick={() => setSelectedColor(color)}
                          border={
                            selectedColor === color ? "2px solid" : "none"
                          }
                          borderColor="blue.500"
                          cursor="pointer"
                        />
                      </Tooltip>
                    ))}
                  </HStack>
                </Box>
              )}

              <Box>
                <Text fontWeight="bold" mb={2} color={textColor}>
                  QUANTITY
                </Text>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  max={10}
                  onChange={(_, value) => setQuantity(value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>

              <Divider />

              <CustomButton
                onClick={handleAddToCart}
                isDisabled={
                  (product.sizes && !selectedSize) ||
                  (product.colors && !selectedColor)
                }
                width="100%"
              >
                ADD TO CART
              </CustomButton>
            </VStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

ProductPreview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onToggleWishlist: PropTypes.func.isRequired,
  isWishlisted: PropTypes.bool.isRequired,
};

export default ProductPreview;
