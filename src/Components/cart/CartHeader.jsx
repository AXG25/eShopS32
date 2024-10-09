import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Text,
  HStack,
  Image,
  Portal,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import CustomButton from "../common/CustomButton";

const CartHeader = () => {
  const { items, getTotalItems, getTotalPrice } = useCartStore();

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <CustomButton
          leftIcon={<FaShoppingCart />}
          colorScheme="blue"
          section="header"
        >
          Carrito ({getTotalItems()})
        </CustomButton>
      </PopoverTrigger>
      <Portal>
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
                      {item.quantity} x €{parseFloat(item.price, { defaultValu: 0 }).toFixed(2)}
                    </Text>
                  </VStack>
                </HStack>
              ))}
              {items.length > 3 && (
                <Text fontSize="sm" color="gray.500">
                  Y {items.length - 3} productos más...
                </Text>
              )}
              <Text fontWeight="bold">
                Total: €{getTotalPrice().toFixed(2)}
              </Text>
              <Link to="/cart" style={{ width: "100%" }}>
                <CustomButton colorScheme="blue" width="100%" section="cart">
                  Ver Carrito
                </CustomButton>
              </Link>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default CartHeader;
