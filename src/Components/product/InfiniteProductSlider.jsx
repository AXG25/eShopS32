import { useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { Box, Image, Text, VStack, Button, Skeleton } from "@chakra-ui/react";
import useProductStore from "../../store/useProductStore";

const ProductSlide = memo(({ product }) => (
  <Box p={4} textAlign="center">
    <Image
      src={product.image}
      alt={product.title}
      height="200px"
      objectFit="contain"
      mx="auto"
      loading="lazy"
    />
    <VStack mt={2}>
      <Text fontWeight="bold" noOfLines={2}>
        {product.title}
      </Text>
      <Text>€{product.price.toFixed(2)}</Text>
      <Button colorScheme="blue" size="sm">
        Ver Detalles
      </Button>
    </VStack>
  </Box>
));

ProductSlide.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

ProductSlide.displayName = "ProductSlide";

const InfiniteProductSlider = () => {
  const { fetchProducts, isLoading, getFeaturedProducts } = useProductStore();
  const featuredProducts = getFeaturedProducts();

  const memoizedFetchProducts = useCallback(() => {
    if (featuredProducts.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, featuredProducts.length]);

  useEffect(() => {
    memoizedFetchProducts();
  }, [memoizedFetchProducts]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    lazyLoad: "ondemand",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <Slider {...settings}>
        {[...Array(4)].map((_, index) => (
          <Box key={index} p={4}>
            <Skeleton height="200px" />
            <VStack mt={2}>
              <Skeleton height="20px" width="80%" />
              <Skeleton height="20px" width="40%" />
              <Skeleton height="30px" width="60%" />
            </VStack>
          </Box>
        ))}
      </Slider>
    );
  }

  return (
    <Slider {...settings}>
      {featuredProducts.map((product) => (
        <ProductSlide key={product.id} product={product} />
      ))}
    </Slider>
  );
};

export default memo(InfiniteProductSlider);
