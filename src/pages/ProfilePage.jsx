import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Divider,
  Input,
  FormControl,
  FormLabel,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import CustomButton from "../Components/common/CustomButton";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
      toast({
        title: t("profileUpdated"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("updateError"),
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxWidth="800px"
      margin="auto"
      mt={8}
      p={6}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="xl"
    >
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="xl" color={textColor}>
            {t("userProfile")}
          </Heading>
          <Avatar size="xl" src={user.avatarUrl} name={user.name} />
        </HStack>

        <Divider />

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>{t("name")}</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!isEditing}
                bg={isEditing ? "white" : "gray.100"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>{t("email")}</FormLabel>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!isEditing}
                bg={isEditing ? "white" : "gray.100"}
              />
            </FormControl>

            {isEditing ? (
              <HStack justify="flex-end" mt={4}>
                <CustomButton
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                >
                  {t("cancel")}
                </CustomButton>
                <CustomButton type="submit" colorScheme="blue">
                  {t("saveChanges")}
                </CustomButton>
              </HStack>
            ) : (
              <CustomButton
                onClick={() => setIsEditing(true)}
                colorScheme="blue"
                mt={4}
              >
                {t("editProfile")}
              </CustomButton>
            )}
          </VStack>
        </form>

        <Divider />

        <VStack align="stretch" spacing={3}>
          <Heading size="md" color={textColor}>
            {t("accountInfo")}
          </Heading>
          <Text>
            <strong>{t("memberSince")}:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
          <Text>
            <strong>{t("lastLogin")}:</strong>{" "}
            {new Date(user.lastLogin).toLocaleDateString()}
          </Text>
        </VStack>

        <CustomButton variant="outline" colorScheme="red">
          {t("deleteAccount")}
        </CustomButton>
      </VStack>
    </Box>
  );
};

export default ProfilePage;
