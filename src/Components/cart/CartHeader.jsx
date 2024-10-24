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
  Tooltip,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import CustomButton from "../common/CustomButton";
import { NumericFormat } from "react-number-format";
import { parseFloat } from "../../utils/numberFormatting";
import { DEFAULT_IMAGE } from "../../constants/images";

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
            ({getTotalItems()})
          </CustomButton>

      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverBody>
            <VStack align="stretch" spacing={4}>
              {items.slice(0, 3).map((item) => (
                <HStack key={item.id} justify="space-between">
                  <Image
                    src={item.image || DEFAULT_IMAGE}
                    alt={item.title}
                    boxSize="50px"
                    objectFit="cover"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="sm">
                      {item.title}
                    </Text>
                    <NumericFormat
                      value={parseFloat(item.price, { defaultValu: 0 })}
                      displayType={"text"}
                      prefix={"$"}
                      thousandSeparator=","
                      decimalSeparator="."
                      fixedDecimalScale={true}
                      renderText={(value) => (
                        <Text fontSize="xs" >
                          {" "}
                          {item.quantity} x {value}
                        </Text>
                      )}
                    />
                  </VStack>
                </HStack>
              ))}
              {items.length > 3 && (
                <Text fontSize="sm" color="gray.500">
                  Y {items.length - 3} productos más...
                </Text>
              )}
              <NumericFormat
                value={getTotalPrice()}
                displayType={"text"}
                prefix={"$"}
                thousandSeparator=","
                decimalSeparator="."
                fixedDecimalScale={true}
                renderText={(value) => <Text fontWeight="bold">{value}</Text>}
              />
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
