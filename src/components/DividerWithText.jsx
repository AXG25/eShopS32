import { Divider, Flex, Text } from "@chakra-ui/react";

const DividerWithText = ({ text }) => {
  return (
    <Flex align="center" my={4}>
    <Divider borderColor="gray.400" />
    <Text px={2} color="gray.400" fontWeight="400">
      {text}
    </Text>
    <Divider borderColor="gray.400" />
  </Flex>
);
  
}

export default DividerWithText
