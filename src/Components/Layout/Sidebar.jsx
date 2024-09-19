import PropTypes from "prop-types";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Button, VStack, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  FaStore,
  FaCog,
  FaTachometerAlt,
  FaSignOutAlt,
  FaUserAlt,
} from "react-icons/fa";
import { IoMdColorPalette } from "react-icons/io";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import { useAuth } from "../../hooks/useAuth";

/**
 * Sidebar - Componente de barra lateral para la navegación principal
 *
 * Este componente muestra una barra lateral con enlaces de navegación y un botón de cierre de sesión.
 * La barra lateral puede estar expandida o colapsada.
 *
 * @param {Object} props - Las propiedades del componente
 * @param {boolean} props.collapsed - Indica si la barra lateral está colapsada
 */

const Sidebar = ({ collapsed }) => {
  const { config } = useStoreConfigStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const color = useColorModeValue("gray.600", "gray.200");

  const handleLogout = () => {
    logout();
    navigate("/login");
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
            <Menu
              menuItemStyles={{
                button: {
                  color: color,
                  "&:hover": {
                    backgroundColor: useColorModeValue(
                      "whiteAlpha.200",
                      "blackAlpha.300"
                    ),
                  },
                },
              }}
            >
              <MenuItem icon={<FaStore />} component={<RouterLink to="/" />}>
                Tienda
              </MenuItem>
              <MenuItem
                icon={<FaCog />}
                component={<RouterLink to="/settings" />}
              >
                Configuración
              </MenuItem>
              <MenuItem
                icon={<IoMdColorPalette />}
                component={<RouterLink to="/customization" />}
              >
                Mercado
              </MenuItem>
              <MenuItem
                icon={<FaTachometerAlt />}
                component={<RouterLink to="/dashboard" />}
              >
                Dashboard
              </MenuItem>
              <MenuItem
                icon={<FaUserAlt />}
                component={<RouterLink to="/profile" />}
              >
                Perfil
              </MenuItem>
            </Menu>
          </Box>
          <Box width="100%" p={2}>
            <Button
              leftIcon={<FaSignOutAlt />}
              variant="outline"
              onClick={handleLogout}
              width="100%"
              bg="whiteAlpha.200"
              _hover={{ bg: "whiteAlpha.300" }}
              size={collapsed ? "sm" : "md"}
            >
              {!collapsed && "Cerrar Sesión"}
            </Button>
          </Box>
        </VStack>
      </ProSidebar>
    </Box>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};

export default Sidebar;
