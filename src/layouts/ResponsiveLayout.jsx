import { useState } from "react";
import PropTypes from "prop-types";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import useStoreConfigStore from "../store/useStoreConfigStore";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";
import Sidebar from "../Components/Layout/Sidebar";

/**
 * ResponsiveLayout - Componente que proporciona un diseño responsivo para la aplicación
 *
 * Este componente crea un diseño de grid que se adapta a diferentes tamaños de pantalla.
 * Incluye un encabezado, una barra lateral colapsable, un área principal de contenido y un pie de página.
 *
 * @param {Object} props - Las propiedades del componente
 * @param {React.ReactNode} props.children - El contenido que se renderizará en el área principal
 */

const ResponsiveLayout = ({ children }) => {
  // Estados
  const [collapsed, setCollapsed] = useState(true);
  const { config } = useStoreConfigStore();

  /**
   * Maneja el toggle de la barra lateral
   */
  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Grid
      templateAreas={{
        base: `"header" "main" "footer"`,
        md: `"header header" "nav main" "footer footer"`,
      }}
      gridTemplateRows={{
        base: "auto 1fr auto",
        md: "auto 1fr auto",
      }}
      gridTemplateColumns={{
        base: "1fr",
        md: `${collapsed ? "80px" : "250px"} 1fr`,
      }}
      h="100vh"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
      transition="all 0.3s"
    >
      <GridItem area="header">
        <Header onToggleSidebar={handleToggleSidebar} config={config} />
      </GridItem>
      <GridItem area="nav" height="100%">
        <Sidebar collapsed={collapsed} />
      </GridItem>
      <GridItem bg="white" area="main" overflowY="auto">
        <Box p={4}>{children}</Box>
      </GridItem>
      <GridItem bg={config.primaryColor} area="footer">
        <Footer />
      </GridItem>
    </Grid>
  );
};

ResponsiveLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ResponsiveLayout;
