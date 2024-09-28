import PropTypes from "prop-types";
import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue,
  Image,
  Box,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../hooks/useDebounce";
import { useState } from "react";
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { config } = useStoreConfigStore();
  const { isAuthenticated, user, logout } = useAuth();

  /**
   * Handles the search action.
   * @function
   */
  const handleSearch = () => {
    console.log("Búsqueda realizada:", debouncedSearchTerm);
    // Implementar lógica de búsqueda real aquí
  };

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
          aria-label={t("toggleSidebar")}
          mr={3}
          section="header"
        />
        <Flex align="center" cursor="pointer" onClick={() => navigate("/")}>
          {config.logo ? (
            <Image
              src={config.logo}
              alt={t("logo")}
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
            {config.title || t("myEcommerce")}
          </Box>
        </Flex>
      </Flex>

      <InputGroup size="md" maxWidth="400px" flex={1} mx={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder={t("searchProducts")}
          borderRadius="full"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
      </InputGroup>

      <Flex align="center">
        <CartHeader />
        {isAuthenticated ? (
          <Menu>
            <MenuButton
              as={ProfileButton}
              user={user}
              ml={4}
            />
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
            leftIcon={<Text fontSize="lg">👤</Text>}
            section="header"
          >
            Iniciar Sesión
          </CustomButton>
        )}
      </Flex>
    </Flex>
  );
};

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
};

export default Header;