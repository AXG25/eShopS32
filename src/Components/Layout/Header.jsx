import PropTypes from "prop-types";
import {
  Flex,
  useColorModeValue,
  Image,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoMdLogIn, IoMdInformationCircle } from "react-icons/io";

import useStoreConfigStore from "../../store/useStoreConfigStore";
import { useAuth } from "../../hooks/useAuth";
import CartHeader from "../cart/CartHeader";
import DefaultLogo from "../Layout/DefaultLogo";
import CustomButton from "../common/CustomButton";
import ProfileButton from "../common/ProfileButton";

/**
 * Header component for the e-commerce application.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onToggleSidebar - Function to toggle the sidebar.
 * @returns {React.ReactElement} The rendered Header component.
 */
const Header = ({ onToggleSidebar }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue("white", "gray.800");
  const { config } = useStoreConfigStore();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg={bgColor}
      color="black"
      boxShadow="sm"
    >
      <Flex align="center" mr={5}>
        <CustomButton
          isIconButton
          icon={<HamburgerIcon />}
          onClick={onToggleSidebar}
          variant="outline"
          aria-label={t("navigation.toggleSidebar")}
          mr={3}
          section="header"
        />
        <Flex align="center" cursor="pointer" onClick={() => navigate("/home")}>
          {config.logo ? (
            <Image
              src={config.logo}
              alt={t("store.logo")}
              boxSize="40px"
              objectFit="contain"
              mr={2}
            />
          ) : (
            <Box width="200px" height="40px">
              <DefaultLogo />
            </Box>
          )}
          <Box fontWeight="bold" fontSize="xl" color={config.headerTextColor}>
            {config.title || t("store.myEcommerce")}
          </Box>
        </Flex>
      </Flex>

      <HStack spacing={4}>
        {/* New "Nosotros" button */}
        <CustomButton
          leftIcon={<IoMdInformationCircle />}
          onClick={() => navigate("/")}
          variant="ghost"
          section="header"
        >
          {t("about.aboutUs")}
        </CustomButton>

        <CartHeader />
        {isAuthenticated ? (
          <Menu>
            <MenuButton as={ProfileButton} user={user} ml={4} />
            <MenuList>
              <MenuItem as={RouterLink} to="/profile">
                Perfil
              </MenuItem>
              <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <CustomButton
            as={RouterLink}
            to="/login"
            ml={4}
            leftIcon={<IoMdLogIn />}
            section="header"
          >
            Iniciar Sesión
          </CustomButton>
        )}
      </HStack>
    </Flex>
  );
};

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
};

export default Header;
