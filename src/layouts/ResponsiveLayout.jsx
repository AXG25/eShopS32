import { useState } from "react";
import PropTypes from "prop-types";
import { Grid, GridItem, Box, Tooltip } from "@chakra-ui/react";
import useStoreConfigStore from "../store/useStoreConfigStore";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";
import Sidebar from "../Components/Layout/Sidebar";

const ResponsiveLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { config } = useStoreConfigStore();

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
      color={config.textColor}
      fontWeight="bold"
      transition="all 0.3s"
    >
      <GridItem area="header">
        <Header onToggleSidebar={handleToggleSidebar} config={config} />
      </GridItem>
      <GridItem area="nav" height="100%" bg={config.asideColor}>
        <Sidebar collapsed={collapsed} />
      </GridItem>
      <GridItem bg={config.backgroundColor} area="main" overflowY="auto">
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