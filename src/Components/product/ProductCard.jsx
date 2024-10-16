import { memo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  AspectRatio,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useCartStore from "../../store/useCartStore";
import ProductPreview from "./ProductPreview ";
import CustomButton from "../common/CustomButton";
import { parseFloat } from "../../utils/numberFormatting";
import { NumericFormat } from "react-number-format";

const MotionBox = motion(Box);

const ProductCard = memo(({ product }) => {
  const { t } = useTranslation();
  const { addItemToCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const formatPrice = (price) => {
    const priceNumber = parseFloat(price, { defaultValu: 0 });
    return priceNumber.toFixed(2);
  };

  const discountedPrice = product.discount
    ? parseFloat(product.price, { defaultValu: 0 }) *
      (1 - parseFloat(product.discount, { defaultValu: 0 }) / 100)
    : parseFloat(product.price, { defaultValu: 0 });

  const handleAddToCart = () => {
    addItemToCart({ ...product, quantity: 1 });
    toast({
      title: t("products.addedToCart"),
      description: t("products.addedToCartDescription"),
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <>
      <MotionBox
        width="300px"
        height="400px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={bgColor}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        boxShadow="md"
      >
        <AspectRatio ratio={4 / 3} width="100%">
          <Box position="relative">
            <Image
              src={product.image}
              alt={product.title}
              objectFit="contain"
              width="100%"
              height="100%"
            />
            {product.discount > 0 && (
              <Badge position="absolute" top={2} left={2} colorScheme="red">
                {product.discount}% {t("products.off")}
              </Badge>
            )}
          </Box>
        </AspectRatio>

        <VStack
          p={4}
          spacing={2}
          align="stretch"
          flex={1}
          justifyContent="space-between"
        >
          <VStack align="stretch" spacing={1}>
            <Text
              fontWeight="bold"
              fontSize="md"
              color={textColor}
              noOfLines={2}
            >
              {product.title}
            </Text>
            <Text fontSize="xs" color="gray.500" noOfLines={1}>
              {t("products.category")}: {product.category}
            </Text>
          </VStack>

          <VStack align="stretch" spacing={2}>
            <HStack justify="space-between">
              <NumericFormat
                value={formatPrice(discountedPrice)}
                displayType={"text"}
                prefix={"$"}
                thousandSeparator=","
                decimalSeparator="."
                fixedDecimalScale={true}
                renderText={(value) => (
                  <Text color={textColor} fontWeight="bold">
                    {value}
                  </Text>
                )}
              />
              {product.discount > 0 && (
                <NumericFormat
                  value={formatPrice(product.price)}
                  displayType={"text"}
                  prefix={"$"}
                  thousandSeparator=","
                  decimalSeparator="."
                  fixedDecimalScale={true}
                  renderText={(value) => (
                    <Text color={textColor} fontWeight="bold">
                      {value}
                    </Text>
                  )}
                />
              )}
            </HStack>

            <HStack>
              <CustomButton
                leftIcon={<FaShoppingCart />}
                onClick={handleAddToCart}
                size="sm"
                flex={1}
              >
                {t("products.addToCart")}
              </CustomButton>
              <CustomButton
                isIconButton
                icon={<FaInfoCircle />}
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                size="sm"
                aria-label={t("products.details")}
              />
            </HStack>
          </VStack>
        </VStack>
      </MotionBox>

      <ProductPreview
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onAddToCart={handleAddToCart}
        onToggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted}
      />
    </>
  );
});

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string),
    colors: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

ProductCard.displayName = "ProductCard";

export default ProductCard;
