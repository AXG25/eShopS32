import {
    Divider,
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
  
    // Función para saber si el enlace está activo
    const isActive = (path) => location.pathname === path;
  
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

            <DividerWithText text="Apariencia"/>

              {/* Link para "banner" */}
              <Text
                _hover={{
                  cursor: "pointer",
                  color: "#3182ce",
                  transform: "scale(1.01)", // Pequeño zoom al hacer hover
                  transition: "all 0.3s ease", // Animación suave
                }}
                color={isActive("/banner") ? "#3182ce" : "black"} // Azul si está activo
                fontWeight={isActive("/banner") ? "800" : "600"} // Negrita si está activo
              >
                <Link to="/banner">Banner</Link>
              </Text>
  
              {/* Link para "Logo" */}
              <Text
                mt={4}
                _hover={{
                  cursor: "pointer",
                  color: "#3182ce",
                  transform: "scale(1.01)", // Pequeño zoom al hacer hover
                  transition: "all 0.3s ease", // Animación suave
                }}
                color={isActive("/logo") ? "#3182ce" : "black"} // Azul si está activo
                fontWeight={isActive("/logo") ? "800" : "600"} // Negrita si está activo
              >
                <Link to="/logo">Logo</Link>
              </Text> 

               {/* Link para "Redes Sociales" */}
               <Text
                mt={4}
                _hover={{
                  cursor: "pointer",
                  color: "#3182ce",
                  transform: "scale(1.01)", // Pequeño zoom al hacer hover
                  transition: "all 0.3s ease", // Animación suave
                }}
                color={isActive("/social") ? "#3182ce" : "black"} // Azul si está activo
                fontWeight={isActive("/sccial") ? "800" : "600"} // Negrita si está activo
              >
                <Link to="/social">Redes sociales</Link>
              </Text>

               {/* Link para "Paleta de colores" */}
               <Text
                mt={4}
                _hover={{
                  cursor: "pointer",
                  color: "#3182ce",
                  transform: "scale(1.01)", // Pequeño zoom al hacer hover
                  transition: "all 0.3s ease", // Animación suave
                }}
                color={isActive("/colorPalette") ? "#3182ce" : "black"} // Azul si está activo
                fontWeight={isActive("/colorPalette") ? "800" : "600"} // Negrita si está activo
              >
                <Link to="/colorPalette">Paleta de colores</Link>
              </Text>

            <DividerWithText text="Paginas"/>
            
             {/* Link para "Nosotros" */}
             <Text
                mt={4}
                _hover={{
                  cursor: "pointer",
                  color: "#3182ce",
                  transform: "scale(1.01)", // Pequeño zoom al hacer hover
                  transition: "all 0.3s ease", // Animación suave
                }}
                color={isActive("/aboutUs") ? "#3182ce" : "black"} // Azul si está activo
                fontWeight={isActive("/aboutUs") ? "800" : "600"} // Negrita si está activo
              >
                <Link to="/aboutUs">Nosotros</Link>
              </Text>

               {/* Link para "Contacto" */}
             <Text
                mt={4}
                _hover={{
                  cursor: "pointer",
                  color: "#3182ce",
                  transform: "scale(1.01)", // Pequeño zoom al hacer hover
                  transition: "all 0.3s ease", // Animación suave
                }}
                color={isActive("/contactUs") ? "#3182ce" : "black"} // Azul si está activo
                fontWeight={isActive("/contactUs") ? "800" : "600"} // Negrita si está activo
              >
                <Link to="/contactUs">Contacto</Link>
              </Text>

              <DividerWithText text="Otros"/>

               {/* Link para "Sincronizador de datos" */}
             <Text
                mt={4}
                _hover={{
                  cursor: "pointer",
                  color: "#3182ce",
                  transform: "scale(1.01)", // Pequeño zoom al hacer hover
                  transition: "all 0.3s ease", // Animación suave
                }}
                color={isActive("/dataSync") ? "#3182ce" : "black"} // Azul si está activo
                fontWeight={isActive("/dataSync") ? "800" : "600"} // Negrita si está activo
              >
                <Link to="/dataSync">Sincronizador de datos</Link>
              </Text>

               {/* Link para "Configuracion" */}
             <Text
                mt={4}
                _hover={{
                  cursor: "pointer",
                  color: "#3182ce",
                  transform: "scale(1.01)", // Pequeño zoom al hacer hover
                  transition: "all 0.3s ease", // Animación suave
                }}
                color={isActive("/config") ? "#3182ce" : "black"} // Azul si está activo
                fontWeight={isActive("/config") ? "800" : "600"} // Negrita si está activo
              >
                <Link to="/config">Configuracion</Link>
              </Text>

            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  };
  
  export default DrawerControlPanel;