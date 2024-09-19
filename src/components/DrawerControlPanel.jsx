import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Text,
  } from "@chakra-ui/react";
  import { Link, useLocation } from "react-router-dom";
  import DividerWithText from "./DividerWithText";
  
  const DrawerControlPanel = ({
    isOpen,
    onClose,
    finalFocusRef,
    placement = "left",
  }) => {
    const location = useLocation();
  
    const isActive = (path) => location.pathname === path;
  
    // Arreglos de los diferentes grupos de enlaces
    const sections = [
      {
        title: "Apariencia",
        links: [
          { name: "Banner", path: "/banner" },
          { name: "Logo", path: "/logo" },
          { name: "Redes sociales", path: "/social" },
          { name: "Paleta de colores", path: "/colorPalette" },
        ],
      },
      {
        title: "Paginas",
        links: [
          { name: "Nosotros", path: "/aboutUs" },
          { name: "Contacto", path: "/contactUs" },
        ],
      },
      {
        title: "Otros",
        links: [
          { name: "Sincronizador de datos", path: "/dataSync" },
          { name: "Configuración", path: "/config" },
        ],
      },
    ];
  
    return (
      <>
        <Drawer
          isOpen={isOpen}
          placement={placement}
          onClose={onClose}
          finalFocusRef={finalFocusRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Panel de Control</DrawerHeader>
  
            <DrawerBody>
              {sections.map((section) => (
                <div key={section.title}>
                  <DividerWithText text={section.title} />
                  {section.links.map((link, index) => (
                    <Text
                      key={index}
                      mt={index > 0 ? 4 : 0} 
                      _hover={{
                        cursor: "pointer",
                        color: "#3182ce",
                        transform: "scale(1.01)", 
                        transition: "all 0.3s ease", 
                      }}
                      color={isActive(link.path) ? "#3182ce" : "black"}
                      fontWeight={isActive(link.path) ? "800" : "600"}
                      position="relative"
                    >
                      <Link to={link.path}>{link.name}</Link>
                    </Text>
                  ))}
                </div>
              ))}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  };
  
  export default DrawerControlPanel;
  