import PropTypes from "prop-types";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Button, VStack, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaStore,
  FaCog,
  FaTachometerAlt,
  FaSignOutAlt,
  FaShoppingCart,
  FaListUl, // Nuevo icono para categorías
} from "react-icons/fa";
import { IoMdColorPalette } from "react-icons/io";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = ({ collapsed }) => {
  const { config } = useStoreConfigStore();
  const { isAuthenticated, hasPermission, logout } = useAuth();
  const color = useColorModeValue("gray.600", "gray.200");
  const hoverBgColor = useColorModeValue("whiteAlpha.200", "blackAlpha.300");

  // Estilos comunes para los elementos del menú
  const menuItemStyles = {
    button: {
      color: color,
      "&:hover": {
        backgroundColor: hoverBgColor,
      },
    },
  };

  return (
    <Box
      as="nav"
      h="100vh"
      bg={config.secondaryColor}
      display="flex"
      flexDirection="column"
    >
      <ProSidebar
        collapsed={collapsed}
        width="250px"
        collapsedWidth="80px"
        style={{ height: "100%" }}
      >
        <VStack h="100%" justify="space-between">
          <Box flexGrow={1} width="100%" overflowY="auto">
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem icon={<FaStore />} component={<RouterLink to="/home" />}>
                Tienda
              </MenuItem>
              {/* Nuevo ítem de menú para categorías */}
              <MenuItem
                icon={<FaListUl />}
                component={<RouterLink to="/categorias" />}
              >
                Categorías
              </MenuItem>
              <MenuItem
                icon={<FaShoppingCart />}
                component={<RouterLink to="/cart" />}
              >
                Carrito
              </MenuItem>
              {isAuthenticated && (
                <MenuItem
                  icon={<FaCog />}
                  component={<RouterLink to="/settings" />}
                >
                  Configuración
                </MenuItem>
              )}
              {hasPermission("admin") && (
                <>
                  <MenuItem
                    icon={<IoMdColorPalette />}
                    component={<RouterLink to="/customization" />}
                  >
                    Personalización
                  </MenuItem>
                  <MenuItem
                    icon={<FaTachometerAlt />}
                    component={<RouterLink to="/dashboard" />}
                  >
                    Dashboard
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
          {isAuthenticated && (
            <Box width="100%" p={2}>
              <Button
                leftIcon={<FaSignOutAlt />}
                variant="outline"
                onClick={logout}
                width="100%"
                bg="whiteAlpha.200"
                _hover={{ bg: "whiteAlpha.300" }}
                size={collapsed ? "sm" : "md"}
              >
                {!collapsed && "Cerrar Sesión"}
              </Button>
            </Box>
          )}
        </VStack>
      </ProSidebar>
    </Box>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};

export default Sidebar;
