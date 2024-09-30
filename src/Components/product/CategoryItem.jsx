import PropTypes from "prop-types";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import DynamicIcon from "../common/DynamicIcon";

const CategoryItem = ({ category, onClick }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const hoverBgColor = useColorModeValue("blue.50", "gray.700");

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Flex
        as="button"
        onClick={onClick}
        direction="column"
        align="center"
        justify="center"
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={4}
        h="120px"
        w="full"
        transition="all 0.3s"
        _hover={{
          bg: hoverBgColor,
          borderColor: "blue.400",
          shadow: "md",
        }}
      >
        <DynamicIcon
          name={category.icon}
          boxSize="40px"
          color={iconColor}
          mb={2}
        />
        <Text fontWeight="medium" fontSize="sm" textAlign="center">
          {category.name}
        </Text>
      </Flex>
    </motion.div>
  );
};

CategoryItem.propTypes = {
  category: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CategoryItem;
