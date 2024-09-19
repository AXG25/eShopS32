import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore";

const CartHeader = () => {
  const { items, getTotalItems, getTotalPrice } = useCartStore();

  return (
    <Popover>
      <PopoverTrigger>
        <Button rightIcon={<FaShoppingCart />} colorScheme="blue">
          Carrito ({getTotalItems()})
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <VStack align="stretch" spacing={4}>
            {items.slice(0, 3).map((item) => (
              <HStack key={item.id} justify="space-between">
                <Image
                  src={item.image}
                  alt={item.title}
                  boxSize="50px"
                  objectFit="cover"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="sm">
                    {item.title}
                  </Text>
                  <Text fontSize="xs">
                    {item.quantity} x €{item.price.toFixed(2)}
                  </Text>
                </VStack>
              </HStack>
            ))}
            {items.length > 3 && (
              <Text fontSize="sm" color="gray.500">
                Y {items.length - 3} productos más...
              </Text>
            )}
            <Text fontWeight="bold">Total: €{getTotalPrice().toFixed(2)}</Text>
            <Link to="/cart">
              <Button colorScheme="blue" width="100%">
                Ver Carrito
              </Button>
            </Link>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CartHeader;
