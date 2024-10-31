import PropTypes from "prop-types";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Tooltip, VStack, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaStore,
  FaSignOutAlt,
  FaShoppingCart,
  FaListUl, // Nuevo icono para categorías
} from "react-icons/fa";
import { IoMdColorPalette } from "react-icons/io";
import useStoreConfigStore from "../../store/useStoreConfigStore";
import { useAuth } from "../../hooks/useAuth";
import { RiCustomerService2Line } from "react-icons/ri";
import CustomButton from "../common/CustomButton";
import { FaPeopleGroup } from "react-icons/fa6";

const Sidebar = ({ collapsed }) => {
  const { config } = useStoreConfigStore();
  const { isAuthenticated, hasPermission, logout } = useAuth();

  return (
    <Box
      as="nav"
      h="100vh"
      bg={config.asideColor}
      display="flex"
      flexDirection="column"
    >
      <ProSidebar
        collapsed={collapsed}
        width="200px"
        collapsedWidth="60px"
        style={{ height: "90%", backgroundColor: config.asideColor }}
        rootStyles={{
          backgroundColor: config.asideColor,
          color: config.textColor,
        }}
      >
        <VStack h="100%" justify="space-between">
          <Box flexGrow={1} width="100%" overflowY="auto">
            <Menu>
              <Tooltip
                label="Tienda"
                aria-label="Tienda"
                hasArrow
                placement="right"
              >
                <MenuItem
                  icon={<FaStore />}
                  component={<RouterLink to="/home" />}
                >
                  Tienda
                </MenuItem>
              </Tooltip>
              {/* Nuevo ítem de menú para categorías */}
              <Tooltip
                label="Categorías"
                aria-label="Categorías"
                hasArrow
                placement="right"
              >
                <MenuItem
                  icon={<FaListUl />}
                  component={<RouterLink to="/categorias" />}
                >
                  Categorías
                </MenuItem>
              </Tooltip>
              <Tooltip
                label="Carrito"
                aria-label="Carrito"
                hasArrow
                placement="right"
              >
                <MenuItem
                  icon={<FaShoppingCart />}
                  component={<RouterLink to="/cart" />}
                >
                  Carrito
                </MenuItem>
              </Tooltip>
              <Tooltip
                label="Contacto"
                aria-label="Contacto"
                hasArrow
                placement="right"
              >
                <MenuItem
                  icon={<RiCustomerService2Line />}
                  component={<RouterLink to="/contact" />}
                >
                  Contacto
                </MenuItem>
              </Tooltip>
              <Tooltip
                label="Nosotros"
                aria-label="Nosotros"
                hasArrow
                placement="right"
              >
                <MenuItem
                  icon={<FaPeopleGroup />}
                  component={<RouterLink to="/" />}
                >
                  Nosotros
                </MenuItem>
              </Tooltip>

            {/*   {isAuthenticated && (
                <Tooltip
                  label="Configuración"
                  aria-label="Configuración"
                  hasArrow
                  placement="right"
                >
                  <MenuItem
                    icon={<FaCog />}
                    component={<RouterLink to="/settings" />}
                  >
                    Configuración
                  </MenuItem>
                </Tooltip>
              )} */}
              {hasPermission("admin") && (
                <>
                  <Tooltip
                    label="Personalización"
                    aria-label="Personalización"
                    hasArrow
                    placement="right"
                  >
                    <MenuItem
                      icon={<IoMdColorPalette />}
                      component={<RouterLink to="/customization" />}
                    >
                      Personalización
                    </MenuItem>
                  </Tooltip>
                  {/* <Tooltip
                    label="Dashboard"
                    aria-label="Dashboard"
                    hasArrow
                    placement="right"
                  >
                    <MenuItem
                      icon={<FaTachometerAlt />}
                      component={<RouterLink to="/dashboard" />}
                    >
                      Dashboard
                    </MenuItem>
                  </Tooltip> */}
                </>
              )}
            </Menu>
          </Box>
          {isAuthenticated && (
            <Box width="100%" p={2}>
              <CustomButton
                leftIcon={<FaSignOutAlt />}
                variant="outline"
                onClick={logout}
                width="100%"
                bg="whiteAlpha.200"
                _hover={{ bg: "whiteAlpha.300" }}
                size={collapsed ? "sm" : "md"}
              >
                {!collapsed && "Cerrar Sesión"}
              </CustomButton>
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
