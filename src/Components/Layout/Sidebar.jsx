import PropTypes from "prop-types";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Button, VStack, Tooltip } from "@chakra-ui/react";
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

const Sidebar = ({ collapsed }) => {
  const { config } = useStoreConfigStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItemStyles = {
    button: {
      color: config.textColor,
      "&:hover": {
        backgroundColor: `rgba(${parseInt(config.buttonColor.slice(1, 3), 16)}, ${parseInt(config.buttonColor.slice(3, 5), 16)}, ${parseInt(config.buttonColor.slice(5, 7), 16)}, ${config.buttonHoverOpacity})`,
      },
    },
  };

  const renderMenuItem = (icon, label, to) => (
    <Tooltip label={label} placement="right" isDisabled={!collapsed}>
      <MenuItem icon={icon} component={<RouterLink to={to} />}>
        {!collapsed && label}
      </MenuItem>
    </Tooltip>
  );

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
        width="250px"
        collapsedWidth="80px"
        style={{ height: "100%" }}
      >
        <VStack h="100%" justify="space-between">
          <Box flexGrow={1} width="100%" overflowY="auto">
            <Menu menuItemStyles={menuItemStyles}>
              {renderMenuItem(<FaStore />, "Tienda", "/")}
              {renderMenuItem(<FaCog />, "Configuración", "/settings")}
              {renderMenuItem(<IoMdColorPalette />, "Personalización", "/customization")}
              {renderMenuItem(<FaTachometerAlt />, "Dashboard", "/dashboard")}
              {renderMenuItem(<FaUserAlt />, "Perfil", "/profile")}
            </Menu>
          </Box>
          <Box width="100%" p={2}>
            <Tooltip label="Cerrar Sesión" placement="right" isDisabled={!collapsed}>
              <Button
                leftIcon={<FaSignOutAlt />}
                variant="outline"
                onClick={handleLogout}
                width="100%"
                bg={config.buttonColor}
                color={config.buttonTextColor}
                _hover={{ opacity: config.buttonHoverOpacity }}
                size={collapsed ? "sm" : "md"}
              >
                {!collapsed && "Cerrar Sesión"}
              </Button>
            </Tooltip>
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