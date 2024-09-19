import {
  Flex,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue,
  Image,
  Box,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDebounce } from "../../hooks/useDebounce";
import { useState } from "react";
import useStoreConfigStore from '../../store/useStoreConfigStore';
import CartHeader from "../cart/CartHeader";

const Header = ({ onToggleSidebar }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue("white", "gray.800");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { config } = useStoreConfigStore();

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
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onToggleSidebar}
          variant="outline"
          aria-label={t('toggleSidebar')}
          mr={3}
        />
        <Flex align="center" cursor="pointer" onClick={() => navigate('/')}>
          {config.logo && (
            <Image src={config.logo} alt={t('logo')} boxSize="40px" objectFit="contain" mr={2} />
          )}
          <Box
            fontWeight="bold"
            fontSize="xl"
            color={config.primaryColor}
          >
            {config.title || t('myEcommerce')}
          </Box>
        </Flex>
      </Flex>

      <InputGroup size="md" maxWidth="400px" flex={1} mx={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder={t('searchProducts')}
          borderRadius="full"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </InputGroup>

      <CartHeader />
    </Flex>
  );
};

export default Header;