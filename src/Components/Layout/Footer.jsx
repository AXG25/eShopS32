import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { FaTwitter, FaYoutube, FaInstagram, FaLinkedin, FaGithub, FaFacebook, FaPinterest } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useStoreConfigStore from "../../store/useStoreConfigStore";

const Footer = () => {
  const { t } = useTranslation();
  const { config } = useStoreConfigStore();
  const bgColor = useColorModeValue("gray.700", "gray.900");
  const textColor = useColorModeValue("gray.200", "gray.400");

  const socialIcons = {
    twitter: FaTwitter,
    youtube: FaYoutube,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    github: FaGithub,
    facebook: FaFacebook,
    pinterest: FaPinterest,
  };

  return (
    <Box bg={bgColor} color={textColor}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              {t("storeInfo")}
            </Text>
            {config.footer.storeInfo.map((info, index) => (
              <Link key={index} href={info.url}>{info.name}</Link>
            ))}
          </Stack>
          
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              {t("customerService")}
            </Text>
            {config.footer.customerService.map((service, index) => (
              <Link key={index} href={service.url}>{service.name}</Link>
            ))}
          </Stack>
          
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              {t("myAccount")}
            </Text>
            {config.footer.myAccount.map((item, index) => (
              <Link key={index} href={item.url}>{item.name}</Link>
            ))}
          </Stack>
          
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              {t("contact")}
            </Text>
            <Text>{config.footer.contact.address}</Text>
            <Text>{config.footer.contact.phone}</Text>
            <Text>{config.footer.contact.email}</Text>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box borderTopWidth={1} borderStyle={"solid"} borderColor={useColorModeValue("gray.600", "gray.800")}>
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ md: "space-between" }}
          align={{ md: "center" }}
        >
          <Text>© {new Date().getFullYear()} {config.title}. {t("allRightsReserved")}</Text>
          <Stack direction={"row"} spacing={6}>
            {config.footer.socialLinks.map((social, index) => {
              const SocialIcon = socialIcons[social.name.toLowerCase()];
              return (
                <IconButton
                  key={index}
                  as="a"
                  href={social.url}
                  aria-label={social.name}
                  icon={<SocialIcon />}
                  size="md"
                  color={textColor}
                  variant="ghost"
                />
              );
            })}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;