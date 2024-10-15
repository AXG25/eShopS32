import PropTypes from "prop-types";
import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue,
  Image,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  useNavigate,
  Link as RouterLink,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../hooks/useDebounce";
import { useCallback, useState } from "react";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import { useAuth } from "../../hooks/useAuth";
import CartHeader from "../cart/CartHeader";
import DefaultLogo from "../Layout/DefaultLogo";
import CustomButton from "../common/CustomButton";
import ProfileButton from "../common/ProfileButton";
import { IoMdLogIn } from "react-icons/io";
import { debounce } from "lodash";
import useProductStore from "../../store/useProductStore";

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

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const navigate = useNavigate();
  const { setFilters } = useProductStore();

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term) {
        setSearchParams({ search: term });
        setFilters({ search: term });
        console.log('', 1)

        navigate(`/home?search=${encodeURIComponent(term)}`);
      } else {
        setSearchParams({});
        setFilters({ search: "" });
        console.log('', 2)
        navigate("/home");
      }
    }, 300),
    [setSearchParams, setFilters, navigate]
  );
  

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedSearch.flush();
  };
  return (
    <form onSubmit={handleSearchSubmit}>
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
          <Flex
            align="center"
            cursor="pointer"
            onClick={() => navigate("/home")}
          >
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

        <InputGroup size="md" maxWidth="400px" flex={1} mx={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={t("store.searchProducts")}
            borderRadius="full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>

        <Flex align="center">
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
        </Flex>
      </Flex>
    </form>
  );
};

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
};

export default Header;
